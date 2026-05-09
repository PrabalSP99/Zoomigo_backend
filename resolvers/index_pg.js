const userResolvers = require('./userResolvers_pg');
const vehicleResolvers = require('./vehicleResolvers_pg');
const vehicleOwnerResolvers = require('./vehicleOwnerResolvers_pg');
const bookingResolvers = require('./bookingResolvers_pg');
const paymentResolvers = require('./paymentResolvers_pg');
const reviewResolvers = require('./reviewResolvers_pg');
const authResolvers = require('./authResolvers_pg');

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
