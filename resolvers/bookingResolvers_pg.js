const bookingQueries = require('../models/bookingQueries');
const vehicleQueries = require('../models/vehicleQueries');
const pool = require('../config/database_pg');

const bookingResolvers = {
  Query: {
    bookings: async (_, __, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        let query = `
          SELECT 
            ub.*,
            v.name as vehicle_name,
            v.make as vehicle_make,
            v.model as vehicle_model,
            v.image_url as vehicle_image,
            u.name as user_name,
            u.email as user_email
          FROM user_bookings ub
          LEFT JOIN vehicles v ON ub.vehicle_id = v.id
          LEFT JOIN users u ON ub.user_id = u.id
        `;
        
        // If not admin, filter by user
        if (user.role !== 'ADMIN') {
          query += ' WHERE ub.user_id = $1';
        }
        
        query += ' ORDER BY ub.created_at DESC';
        
        const result = user.role === 'ADMIN' 
          ? await pool.query(query)
          : await pool.query(query, [user.id]);
        
        return result.rows.map(row => bookingQueries.formatBooking(row));
      } catch (error) {
        throw new Error('Failed to fetch bookings');
      }
    },
    
    booking: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        const query = `
          SELECT 
            ub.*,
            v.name as vehicle_name,
            v.make as vehicle_make,
            v.model as vehicle_model,
            v.image_url as vehicle_image,
            u.name as user_name,
            u.email as user_email
          FROM user_bookings ub
          LEFT JOIN vehicles v ON ub.vehicle_id = v.id
          LEFT JOIN users u ON ub.user_id = u.id
          WHERE ub.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
          throw new Error('Booking not found');
        }
        
        const booking = bookingQueries.formatBooking(result.rows[0]);
        
        // Check authorization
        if (booking.userId !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        return booking;
      } catch (error) {
        throw new Error('Failed to fetch booking');
      }
    },
  },
  
  Mutation: {
    createBooking: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        const { vehicleId, startTime, endTime, locationDetail } = input;
        
        // Check vehicle availability
        const vehicle = await vehicleQueries.getVehicleById(vehicleId);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        
        if (vehicle.availabilityStatus !== 'AVAILABLE') {
          throw new Error('Vehicle is not available');
        }
        
        // Check for conflicts
        const isAvailable = await vehicleQueries.checkAvailability(vehicleId, startTime, endTime);
        if (!isAvailable) {
          throw new Error('Vehicle is not available for the selected time period');
        }
        
        // Calculate total amount
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);
        const durationMs = endTimeDate - startTimeDate;
        const durationHours = durationMs / (1000 * 60 * 60);
        const durationDays = durationMs / (1000 * 60 * 60 * 24);
        const durationWeeks = durationMs / (1000 * 60 * 60 * 24 * 7);
        
        let totalAmount;
        if (durationHours <= 24) {
          totalAmount = Math.ceil(durationHours) * vehicle.pricing.perHour;
        } else if (durationDays <= 7) {
          totalAmount = Math.ceil(durationDays) * vehicle.pricing.perDay;
        } else {
          totalAmount = Math.ceil(durationWeeks) * vehicle.pricing.perWeek;
        }
        
        // Create booking
        return await bookingQueries.createBooking({
          userId: user.id,
          vehicleId,
          startTime,
          endTime,
          locationDetail,
          totalAmount
        });
      } catch (error) {
        throw new Error(error.message || 'Failed to create booking');
      }
    },
    
    updateBooking: async (_, { id, input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        // Check ownership
        const checkQuery = 'SELECT user_id FROM user_bookings WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
          throw new Error('Booking not found');
        }
        
        if (checkResult.rows[0].user_id !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        // Update booking
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (input.status) {
          updates.push(`status = $${paramIndex++}`);
          values.push(input.status);
        }
        
        if (updates.length === 0) {
          throw new Error('No fields to update');
        }
        
        values.push(id);
        const query = `
          UPDATE user_bookings 
          SET ${updates.join(', ')}, updated_at = NOW()
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await pool.query(query, values);
        return bookingQueries.formatBooking(result.rows[0]);
      } catch (error) {
        throw new Error('Failed to update booking');
      }
    },
    
    cancelBooking: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        // Check ownership and status
        const checkQuery = 'SELECT user_id, status FROM user_bookings WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);
        
        if (checkResult.rows.length === 0) {
          throw new Error('Booking not found');
        }
        
        const booking = checkResult.rows[0];
        
        if (booking.user_id !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
          throw new Error('Booking cannot be cancelled');
        }
        
        // Cancel booking
        const query = `
          UPDATE user_bookings 
          SET status = 'CANCELLED', updated_at = NOW()
          WHERE id = $1
          RETURNING *
        `;
        
        const result = await pool.query(query, [id]);
        return bookingQueries.formatBooking(result.rows[0]);
      } catch (error) {
        throw new Error('Failed to cancel booking');
      }
    },
  },
  
  Booking: {
    payment: async (parent) => {
      try {
        const query = 'SELECT * FROM payments WHERE booking_id = $1';
        const result = await pool.query(query, [parent.id]);
        return result.rows[0] || null;
      } catch (error) {
        return null;
      }
    },
    
    review: async (parent) => {
      try {
        const query = 'SELECT * FROM reviews WHERE booking_id = $1';
        const result = await pool.query(query, [parent.id]);
        return result.rows[0] || null;
      } catch (error) {
        return null;
      }
    },
    
    vehicle: async (parent) => {
      try {
        return await vehicleQueries.getVehicleById(parent.vehicleId);
      } catch (error) {
        return null;
      }
    },
    
    user: async (parent) => {
      try {
        const userQueries = require('../models/userQueries');
        return await userQueries.getUserById(parent.userId);
      } catch (error) {
        return null;
      }
    },
  },
};

module.exports = bookingResolvers;
