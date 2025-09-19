const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authResolvers = {
  Mutation: {
    loginUser: async (_, { email, password }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }
        
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        // Generate refresh token (optional)
        const refreshToken = jwt.sign(
          { userId: user._id, type: 'refresh' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        return {
          token,
          refreshToken,
          user: { ...user.toObject(), password: undefined }
        };
      } catch (error) {
        throw new Error(error.message || 'Login failed');
      }
    },
  },
};

module.exports = authResolvers;
