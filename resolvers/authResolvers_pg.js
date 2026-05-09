const userQueries = require('../models/userQueries');
const jwt = require('jsonwebtoken');

const authResolvers = {
  Mutation: {
    loginUser: async (_, { email, password }) => {
      try {
        const user = await userQueries.getUserByEmail(email);
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        const isPasswordValid = await userQueries.verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        const refreshToken = jwt.sign(
          { userId: user.id, type: 'refresh' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return {
          token,
          refreshToken,
          user: userQueries.formatUser(user)
        };
      } catch (error) {
        throw new Error(error.message || 'Login failed');
      }
    },
  },
};

module.exports = authResolvers;
