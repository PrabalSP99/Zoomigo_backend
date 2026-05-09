
// models/bookingQueries.js - PostgreSQL Booking Queries
const pool = require('../config/database');

const bookingQueries = {
  // Create booking
  async createBooking(input) {
    const query = `
      INSERT INTO user_bookings (
        user_id, vehicle_id, owner_id,
        start_time, end_time,
        pickup_city, pickup_state, pickup_address,
        pickup_latitude, pickup_longitude,
        total_amount, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    // Get owner_id from vehicle
    const vehicleQuery = 'SELECT owner_id FROM vehicles WHERE id = $1';
    const vehicleResult = await pool.query(vehicleQuery, [input.vehicleId]);
    const ownerId = vehicleResult.rows[0].owner_id;
    
    const result = await pool.query(query, [
      input.userId,
      input.vehicleId,
      ownerId,
      input.startTime,
      input.endTime,
      input.locationDetail.city,
      input.locationDetail.state,
      input.locationDetail.address,
      input.locationDetail.lat,
      input.locationDetail.lon,
      input.totalAmount,
      'PENDING'
    ]);
    
    return this.formatBooking(result.rows[0]);
  },
  
  // Get user bookings
  async getUserBookings(userId) {
    const query = `
      SELECT 
        ub.*,
        v.name as vehicle_name,
        v.make as vehicle_make,
        v.model as vehicle_model,
        v.image_url as vehicle_image
      FROM user_bookings ub
      LEFT JOIN vehicles v ON ub.vehicle_id = v.id
      WHERE ub.user_id = $1
      ORDER BY ub.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows.map(row => this.formatBooking(row));
  },
  
  // Format booking data
  formatBooking(row) {
    return {
      id: row.id,
      userId: row.user_id,
      vehicleId: row.vehicle_id,
      ownerId: row.owner_id,
      startTime: row.start_time,
      endTime: row.end_time,
      locationDetail: {
        city: row.pickup_city,
        state: row.pickup_state,
        address: row.pickup_address,
        lat: row.pickup_latitude ? parseFloat(row.pickup_latitude) : null,
        lon: row.pickup_longitude ? parseFloat(row.pickup_longitude) : null
      },
      totalAmount: row.total_amount,
      status: row.status,
      paymentId: row.payment_id,
      createdAt: row.created_at,
      vehicle: row.vehicle_name ? {
        name: row.vehicle_name,
        make: row.vehicle_make,
        model: row.vehicle_model,
        imageUrl: row.vehicle_image
      } : null
    };
  }
};

module.exports = bookingQueries;
