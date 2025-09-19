const Review = require('../models/Review');
const Booking = require('../models/Booking');

const reviewResolvers = {
  Query: {
    reviews: async (_, { first }) => {
      try {
        let query = Review.find({})
          .populate('user', '-password')
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
        
        if (first) {
          query = query.limit(first);
        }
        
        return await query.sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch reviews');
      }
    },
    review: async (_, { id }) => {
      try {
        const review = await Review.findById(id)
          .populate('user', '-password')
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
        
        if (!review) {
          throw new Error('Review not found');
        }
        
        return review;
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
        
        const user = context.user;
        
        const { bookingId, rating, comment } = input;
        
        // Check if booking exists and belongs to user
        const booking = await Booking.findById(bookingId).populate('user');
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        if (booking.user.id !== user.id) {
          throw new Error('Unauthorized access');
        }
        
        // Check if booking is completed
        if (booking.status !== 'COMPLETED') {
          throw new Error('Can only review completed bookings');
        }
        
        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
          throw new Error('Review already exists for this booking');
        }
        
        // Validate rating
        if (rating < 0 || rating > 5) {
          throw new Error('Rating must be between 0 and 5');
        }
        
        const review = new Review({
          booking: bookingId,
          user: user.id,
          rating,
          comment
        });
        
        const savedReview = await review.save();
        
        return await Review.findById(savedReview.id)
          .populate('user', '-password')
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
      } catch (error) {
        throw new Error(error.message || 'Failed to create review');
      }
    },
    updateReview: async (_, { id, input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        const review = await Review.findById(id);
        if (!review) {
          throw new Error('Review not found');
        }
        
        // Check if user owns this review
        if (review.user.toString() !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        // Validate rating if provided
        if (input.rating && (input.rating < 0 || input.rating > 5)) {
          throw new Error('Rating must be between 0 and 5');
        }
        
        const updatedReview = await Review.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        )
          .populate('user', '-password')
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
        
        return updatedReview;
      } catch (error) {
        throw new Error('Failed to update review');
      }
    },
    deleteReview: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        const review = await Review.findById(id);
        if (!review) {
          throw new Error('Review not found');
        }
        
        // Check if user owns this review or is admin
        if (review.user.toString() !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        await Review.findByIdAndDelete(id);
        return true;
      } catch (error) {
        throw new Error('Failed to delete review');
      }
    },
  },
  Review: {
    // Field resolvers for relationships
    booking: async (parent) => {
      try {
        return await Booking.findById(parent.booking)
          .populate('vehicle')
          .populate('user', '-password');
      } catch (error) {
        throw new Error('Failed to fetch review booking');
      }
    },
    user: async (parent) => {
      try {
        const User = require('../models/User');
        return await User.findById(parent.user).select('-password');
      } catch (error) {
        throw new Error('Failed to fetch review user');
      }
    },
  },
};

module.exports = reviewResolvers;
