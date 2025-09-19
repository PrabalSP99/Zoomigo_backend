const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const VehicleOwner = require('../models/VehicleOwner');
const { sendBookingConfirmationEmail, sendCustomerBookingConfirmationEmail } = require('../services/emailService');

const paymentResolvers = {
  Query: {
    payments: async (_, __, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        // If admin, return all payments, otherwise return user's payments
        const query = user.role === 'ADMIN' ? {} : { user: user.id };
        
        return await Payment.find(query)
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          })
          .sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch payments');
      }
    },
    payment: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        const payment = await Payment.findById(id)
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
        
        if (!payment) {
          throw new Error('Payment not found');
        }
        
        // Check if user owns this payment or is admin
        if (payment.booking.user.id !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        return payment;
      } catch (error) {
        throw new Error('Failed to fetch payment');
      }
    },
  },
  Mutation: {
    createPayment: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        const { bookingId, amount, method, transactionId, metadata } = input;
        
        // Check if booking exists and belongs to user
        const booking = await Booking.findById(bookingId).populate('user');
        if (!booking) {
          throw new Error('Booking not found');
        }
        
        if (booking.user.id !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        // Check if payment already exists for this booking
        const existingPayment = await Payment.findOne({ booking: bookingId });
        if (existingPayment) {
          throw new Error('Payment already exists for this booking');
        }
        
        // Validate amount matches booking total
        if (amount !== booking.totalAmount) {
          throw new Error('Payment amount does not match booking total');
        }
        
        const payment = new Payment({
          booking: bookingId,
          amount,
          method,
          transactionId,
          metadata,
          status: 'PENDING'
        });
        
        const savedPayment = await payment.save();
        
        // Update booking status to confirmed
        await Booking.findByIdAndUpdate(bookingId, { status: 'CONFIRMED' });
        
        // Send email notifications after successful payment
        try {
          // Get complete booking data with all populated fields
          const completeBooking = await Booking.findById(bookingId)
            .populate({
              path: 'vehicle',
              populate: {
                path: 'owner',
                model: 'VehicleOwner'
              }
            })
            .populate('user', '-password');
          
          if (completeBooking) {
            // Send email to vehicle owner
            await sendBookingConfirmationEmail(
              completeBooking,
              completeBooking.vehicle.owner,
              completeBooking.user
            );
            
            // Send email to customer - COMMENTED OUT FOR NOW
            // await sendCustomerBookingConfirmationEmail(
            //   completeBooking,
            //   completeBooking.user
            // );
          }
        } catch (emailError) {
          // Log email error but don't fail the payment creation
          console.error('Email notification failed:', emailError);
        }
        
        return await Payment.findById(savedPayment.id)
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
      } catch (error) {
        throw new Error(error.message || 'Failed to create payment');
      }
    },
    updatePayment: async (_, { id, input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        
        const user = context.user;
        
        const payment = await Payment.findById(id).populate('booking');
        if (!payment) {
          throw new Error('Payment not found');
        }
        
        // Check if user owns this payment or is admin
        if (payment.booking.user.toString() !== user.id && user.role !== 'ADMIN') {
          throw new Error('Unauthorized access');
        }
        
        const updatedPayment = await Payment.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        )
          .populate({
            path: 'booking',
            populate: [
              { path: 'vehicle' },
              { path: 'user', select: '-password' }
            ]
          });
        
        return updatedPayment;
      } catch (error) {
        throw new Error('Failed to update payment');
      }
    },
  },
  Payment: {
    // Field resolver for booking relationship
    booking: async (parent) => {
      try {
        return await Booking.findById(parent.booking)
          .populate('vehicle')
          .populate('user', '-password');
      } catch (error) {
        throw new Error('Failed to fetch payment booking');
      }
    },
  },
};

module.exports = paymentResolvers;
