const VehicleOwner = require('../models/VehicleOwner');
const Vehicle = require('../models/Vehicle');

const vehicleOwnerResolvers = {
  Query: {
    vehicleOwners: async () => {
      try {
        return await VehicleOwner.find().sort({ createdAt: -1 });
      } catch (error) {
        console.error('Error fetching vehicle owners:', error);
        throw new Error('Failed to fetch vehicle owners');
      }
    },
    vehicleOwner: async (_, { id }) => {
      try {
        const vehicleOwner = await VehicleOwner.findById(id);
        if (!vehicleOwner) {
          throw new Error('Vehicle owner not found');
        }
        return vehicleOwner;
      } catch (error) {
        console.error('Error fetching vehicle owner:', error);
        throw new Error('Failed to fetch vehicle owner');
      }
    },
  },
  VehicleOwner: {
    vehicles: async (parent) => {
      try {
        return await Vehicle.find({ owner: parent._id }).sort({ createdAt: -1 });
      } catch (error) {
        console.error('Error fetching vehicles for owner:', error);
        throw new Error('Failed to fetch vehicles for owner');
      }
    },
  },
};

module.exports = vehicleOwnerResolvers;
