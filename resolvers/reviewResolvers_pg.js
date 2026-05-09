const pool = require('../config/database_pg');

const reviewResolvers = {
  Query: {
    reviews: async () => {
      try {
        const result = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
        return result.rows;
      } catch (error) {
        throw new Error('Failed to fetch reviews');
      }
    },
    review: async (_, { id }) => {
      try {
        const result = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          throw new Error('Review not found');
        }
        return result.rows[0];
      } catch (error) {
        throw new Error('Failed to fetch review');
      }
    },
  },
  Mutation: {
    createReview: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const query = `
          INSERT INTO reviews (booking_id, user_id, rating, comment)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        
        const result = await pool.query(query, [
          input.bookingId,
          context.user.id,
          input.rating,
          input.comment
        ]);
        
        return result.rows[0];
      } catch (error) {
        throw new Error('Failed to create review');
      }
    },
  },
  Review: {
    user: async (parent) => {
      try {
        const userQueries = require('../models/userQueries');
        return await userQueries.getUserById(parent.user_id);
      } catch (error) {
        return null;
      }
    },
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

module.exports = reviewResolvers;
