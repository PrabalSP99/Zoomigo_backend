const userResolvers = require('./userResolvers');
const vehicleResolvers = require('./vehicleResolvers');
const vehicleOwnerResolvers = require('./vehicleOwnerResolvers');
const bookingResolvers = require('./bookingResolvers');
const paymentResolvers = require('./paymentResolvers');
const reviewResolvers = require('./reviewResolvers');
const authResolvers = require('./authResolvers');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...vehicleResolvers.Query,
    ...vehicleOwnerResolvers.Query,
    ...bookingResolvers.Query,
    ...paymentResolvers.Query,
    ...reviewResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...vehicleResolvers.Mutation,
    ...bookingResolvers.Mutation,
    ...paymentResolvers.Mutation,
    ...reviewResolvers.Mutation,
    ...authResolvers.Mutation,
  },
  User: userResolvers.User,
  Vehicle: vehicleResolvers.Vehicle,
  VehicleOwner: vehicleOwnerResolvers.VehicleOwner,
  Booking: bookingResolvers.Booking,
  Payment: paymentResolvers.Payment,
  Review: reviewResolvers.Review,
};

module.exports = resolvers;
