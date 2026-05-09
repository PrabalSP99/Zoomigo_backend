const pool = require('../config/database_pg');

const paymentResolvers = {
  Query: {
    payments: async () => {
      try {
        const result = await pool.query('SELECT * FROM payments ORDER BY created_at DESC');
        return result.rows;
      } catch (error) {
        throw new Error('Failed to fetch payments');
      }
    },
    payment: async (_, { id }) => {
      try {
        const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          throw new Error('Payment not found');
        }
        return result.rows[0];
      } catch (error) {
        throw new Error('Failed to fetch payment');
      }
    },
  },
  Mutation: {
    createPayment: async (_, { input }) => {
      try {
        const query = `
          INSERT INTO payments (booking_id, amount, status, payment_method, transaction_id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        const result = await pool.query(query, [
          input.bookingId,
          input.amount,
          input.status || 'PENDING',
          input.method,
          input.transactionId
        ]);
        
        return result.rows[0];
      } catch (error) {
        throw new Error('Failed to create payment');
      }
    },
  },
  Payment: {
    booking: async (parent) => {
      try {
        const bookingQueries = require('../models/bookingQueries');
        const result = await pool.query('SELECT * FROM user_bookings WHERE id = $1', [parent.booking_id]);
        if (result.rows.length === 0) return null;
        return bookingQueries.formatBooking(result.rows[0]);
      } catch (error) {
        return null;
      }
    },
  },
};

module.exports = paymentResolvers;
