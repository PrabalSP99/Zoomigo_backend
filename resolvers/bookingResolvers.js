const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');

const bookingResolvers = {
  Query: {
    bookings: async (_, __, context) => {
      try {
        // Check authentication
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        // If admin, return all bookings, otherwise return user's bookings
        const query = user.role === 'ADMIN' ? {} : { user: user.id };
        
        return await Booking.find(query)
          .populate('vehicle')
          .populate('user', '-password')
          .sort({ createdAt: -1 });
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
        
        const booking = await Booking.findById(id)
          .populate('vehicle')
          .populate('user', '-password');
        
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        // Check if user owns this booking or is admin
        if (booking.user.id !== user.id && user.role !== 'ADMIN') {
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
        
        // Check if vehicle exists and is available
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        
        if (vehicle.availabilityStatus !== 'AVAILABLE') {
          throw new Error('Vehicle is not available');
        }
        
        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
          vehicle: vehicleId,
          status: { $in: ['PENDING', 'CONFIRMED'] },
          $or: [
            {
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            }
          ]
        });
        
        if (conflictingBooking) {
          throw new Error('Vehicle is not available for the selected time period');
        }
        
        // Calculate total amount based on booking type
        const startTimeDate = new Date(startTime);
        const endTimeDate = new Date(endTime);
        const durationMs = endTimeDate - startTimeDate;
        
        let totalAmount;
        const durationHours = durationMs / (1000 * 60 * 60);
        const durationDays = durationMs / (1000 * 60 * 60 * 24);
        const durationWeeks = durationMs / (1000 * 60 * 60 * 24 * 7);
        
        // Determine booking type based on duration
        if (durationHours <= 24) {
          // Hourly booking
          totalAmount = Math.ceil(durationHours) * vehicle.pricing.perHour;
        } else if (durationDays <= 7) {
          // Daily booking
          totalAmount = Math.ceil(durationDays) * vehicle.pricing.perDay;
        } else {
          // Weekly booking
          totalAmount = Math.ceil(durationWeeks) * vehicle.pricing.perWeek;
        }
        
        const booking = new Booking({
          vehicle: vehicleId,
          user: user.id,
          locationDetail,
          startTime,
          endTime,
          totalAmount,
          status: 'PENDING'
        });
        
        const savedBooking = await booking.save();
        
        return await Booking.findById(savedBooking.id)
          .populate('vehicle')
          .populate('user', '-password');
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
        
        const booking = await Booking.findById(id);
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        // Check if user owns this booking or is admin
        if (booking.user.toString() !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        const updatedBooking = await Booking.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        )
          .populate('vehicle')
          .populate('user', '-password');
        
        return updatedBooking;
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
        
        const booking = await Booking.findById(id);
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        // Check if user owns this booking or is admin
        if (booking.user.toString() !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        // Check if booking can be cancelled
        if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
          throw new Error('Booking cannot be cancelled');
        }
        
        const updatedBooking = await Booking.findByIdAndUpdate(
          id,
          { status: 'CANCELLED' },
          { new: true }
        )
          .populate('vehicle')
          .populate('user', '-password');
        
        return updatedBooking;
      } catch (error) {
        throw new Error('Failed to cancel booking');
      }
    },
  },
  Booking: {
    payment: async (parent) => {
      try {
        const Payment = require('../models/Payment');
        return await Payment.findOne({ booking: parent.id });
      } catch (error) {
        throw new Error('Failed to fetch booking payment');
      }
    },
    review: async (parent) => {
      try {
        const Review = require('../models/Review');
        return await Review.findOne({ booking: parent.id }).populate('user');
      } catch (error) {
        throw new Error('Failed to fetch booking review');
      }
    },
  },
};

module.exports = bookingResolvers;
