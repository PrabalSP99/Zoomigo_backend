const userQueries = require('../models/userQueries');
const bookingQueries = require('../models/bookingQueries');

const userResolvers = {
  Query: {
    users: async () => {
      try {
        const pool = require('../config/database_pg');
        const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        return result.rows.map(row => userQueries.formatUser(row));
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await userQueries.getUserById(id);
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error('Failed to fetch user');
      }
    },
  },
  Mutation: {
    createUser: async (_, { input }) => {
      try {
        const existingUser = await userQueries.getUserByEmail(input.email);
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
        
        return await userQueries.createUser(input);
      } catch (error) {
        throw new Error(error.message || 'Failed to create user');
      }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const pool = require('../config/database_pg');
        const updates = [];
        const values = [];
        let paramIndex = 1;
        
        if (input.name) {
          updates.push(`name = $${paramIndex++}`);
          values.push(input.name);
        }
        if (input.phone) {
          updates.push(`phone = $${paramIndex++}`);
          values.push(input.phone);
        }
        if (input.DOB) {
          updates.push(`dob = $${paramIndex++}`);
          values.push(input.DOB);
        }
        
        if (updates.length === 0) {
          throw new Error('No fields to update');
        }
        
        values.push(id);
        const query = `
          UPDATE users 
          SET ${updates.join(', ')}, updated_at = NOW()
          WHERE id = $${paramIndex}
          RETURNING *
        `;
        
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
          throw new Error('User not found');
        }
        
        return userQueries.formatUser(result.rows[0]);
      } catch (error) {
        throw new Error('Failed to update user');
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const pool = require('../config/database_pg');
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        if (result.rowCount === 0) {
          throw new Error('User not found');
        }
        return true;
      } catch (error) {
        throw new Error('Failed to delete user');
      }
    },
  },
  User: {
    id: (parent) => parent.id,
    bookings: async (parent, { first, filters }) => {
      try {
        const bookings = await bookingQueries.getUserBookings(parent.id);
        
        let filtered = bookings;
        if (filters) {
          if (filters.status) {
            filtered = filtered.filter(b => b.status === filters.status);
          }
          if (filters.startDate) {
            filtered = filtered.filter(b => new Date(b.startTime) >= new Date(filters.startDate));
          }
          if (filters.endDate) {
            filtered = filtered.filter(b => new Date(b.endTime) <= new Date(filters.endDate));
          }
        }
        
        if (first) {
          filtered = filtered.slice(0, first);
        }
        
        return filtered;
      } catch (error) {
        throw new Error('Failed to fetch user bookings');
      }
    },
  },
};

module.exports = userResolvers;
