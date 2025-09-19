const User = require('../models/User');
const bcrypt = require('bcryptjs');

const userResolvers = {
  Query: {
    users: async () => {
      try {
        return await User.find({}).select('-password');
      } catch (error) {
        throw new Error('Failed to fetch users');
      }
    },
    user: async (_, { id }) => {
      try {
        const user = await User.findById(id).select('-password');
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
        const { email, password, ...userData } = input;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        const user = new User({
          ...userData,
          email,
          password: hashedPassword,
        });
        
        const savedUser = await user.save();
        return savedUser.toObject() ;
      } catch (error) {
        throw new Error(error.message || 'Failed to create user');
      }
    },
    updateUser: async (_, { id, input }) => {
      try {
        const user = await User.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
          throw new Error('User not found');
        }
        
        return user;
      } catch (error) {
        throw new Error('Failed to update user');
      }
    },
    deleteUser: async (_, { id }) => {
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          throw new Error('User not found');
        }
        return true;
      } catch (error) {
        throw new Error('Failed to delete user');
      }
    },
  },
  User: {
    id: (parent) => parent._id.toString(),

    bookings: async (parent, { first, filters }) => {
      try {
        const Booking = require('../models/Booking');
        let query = { user: parent.id };
        
        if (filters) {
          if (filters.status) query.status = filters.status;
          if (filters.startDate) query.startTime = { $gte: filters.startDate };
          if (filters.endDate) query.endTime = { $lte: filters.endDate };
        }
        
        let bookingsQuery = Booking.find(query).populate('vehicle');
        
        if (first) {
          bookingsQuery = bookingsQuery.limit(first);
        }
        
        return await bookingsQuery.sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch user bookings');
      }
    },
  },
};

module.exports = userResolvers;
