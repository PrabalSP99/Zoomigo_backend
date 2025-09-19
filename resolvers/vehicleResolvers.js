const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const VehicleOwner = require('../models/VehicleOwner');

const vehicleResolvers = {
  Query: {
    vehicles: async (_, { filters }) => {
      try {
        let query = {};
        
        if (filters) {
          // Basic filters
          if (filters.type) query.type = filters.type;
          if (filters.brand) query.brand = { $regex: filters.brand, $options: 'i' };
          if (filters.model) query.model = { $regex: filters.model, $options: 'i' };
          if (filters.city) query['location.city'] = { $regex: filters.city, $options: 'i' };
          if (filters.availabilityStatus) query.availabilityStatus = filters.availabilityStatus;
          if (filters.featured !== undefined) query.featured = filters.featured;
          
          // Engine spec filters
          if (filters.fuelType) query['engineSpec.fuelType'] = { $regex: filters.fuelType, $options: 'i' };
          if (filters.driveMode) query['engineSpec.driveMode'] = filters.driveMode;
          if (filters.seats) query['engineSpec.seats'] = { $gte: filters.seats };
          
          // Price range filtering
          if (filters.minPrice || filters.maxPrice) {
            query['pricing.perDay'] = {};
            if (filters.minPrice) query['pricing.perDay'].$gte = filters.minPrice;
            if (filters.maxPrice) query['pricing.perDay'].$lte = filters.maxPrice;
          }
        }
        
        let vehicles = await Vehicle.find(query);
        
        // Handle availability filtering (check for conflicting bookings)
        if (filters?.availability?.startTime && filters?.availability?.endTime) {
          const startTime = new Date(filters.availability.startTime);
          const endTime = new Date(filters.availability.endTime);
          
          const conflictingBookings = await Booking.find({
            status: { $in: ['PENDING', 'CONFIRMED'] },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
          }).select('vehicle');
          
          const conflictingVehicleIds = conflictingBookings.map(booking => booking.vehicle.toString());
          
          vehicles = vehicles.filter(vehicle => 
            !conflictingVehicleIds.includes(vehicle._id.toString())
          );
        }
        
        // Handle sorting
        if (filters?.sortBy) {
          switch (filters.sortBy) {
            case 'PRICE_LOW_TO_HIGH':
              vehicles.sort((a, b) => a.pricing.perDay - b.pricing.perDay);
              break;
            case 'PRICE_HIGH_TO_LOW':
              vehicles.sort((a, b) => b.pricing.perDay - a.pricing.perDay);
              break;
            case 'RATING_HIGH_TO_LOW':
              // For now, sort by creation date (can be enhanced with actual ratings)
              vehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            case 'DISTANCE_NEAREST':
              // For now, sort by creation date (can be enhanced with location-based sorting)
              vehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              break;
            default:
              vehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          }
        } else {
          vehicles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // Handle pagination
        if (filters?.first) {
          vehicles = vehicles.slice(0, filters.first);
        }
        
        return vehicles;
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error('Failed to fetch vehicles');
      }
    },
    vehicle: async (_, { id }) => {
      try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        return vehicle;
      } catch (error) {
        throw new Error('Failed to fetch vehicle');
      }
    },
    vehiclesByLocation: async (_, { city }) => {
      try {
        return await Vehicle.find({
          'location.city': { $regex: city, $options: 'i' },
          availabilityStatus: 'AVAILABLE'
        }).sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch vehicles by location');
      }
    },
    vehiclesByType: async (_, { type }) => {
      try {
        return await Vehicle.find({
          type,
          availabilityStatus: 'AVAILABLE'
        }).sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch vehicles by type');
      }
    },
    availableVehicles: async () => {
      try {
        return await Vehicle.find({ availabilityStatus: 'AVAILABLE' }).sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch available vehicles');
      }
    },
    checkVehicleAvailability: async (_, { vehicleId, startTime, endTime }) => {
      try {
        const Booking = require('../models/Booking');
        
        // Find conflicting bookings
        const conflictingBookings = await Booking.find({
          vehicle: vehicleId,
          status: { $in: ['PENDING', 'CONFIRMED'] },
          $or: [
            {
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            }
          ]
        }).populate('user');
        
        const available = conflictingBookings.length === 0;
        
        return {
          available,
          conflictingBookings
        };
      } catch (error) {
        throw new Error('Failed to check vehicle availability');
      }
    },
  },
  Mutation: {
    createVehicle: async (_, { input }) => {
      try {
        const vehicle = new Vehicle(input);
        const savedVehicle = await vehicle.save();
        return savedVehicle;
      } catch (error) {
        throw new Error('Failed to create vehicle');
      }
    },
    updateVehicle: async (_, { id, input }) => {
      try {
        const vehicle = await Vehicle.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );
        
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        
        return vehicle;
      } catch (error) {
        throw new Error('Failed to update vehicle');
      }
    },
    deleteVehicle: async (_, { id }) => {
      try {
        const vehicle = await Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        return true;
      } catch (error) {
        throw new Error('Failed to delete vehicle');
      }
    },
  },
  Vehicle: {
    owner: async (parent) => {
      try {
        return await VehicleOwner.findById(parent.owner);
      } catch (error) {
        console.error('Error fetching vehicle owner:', error);
        throw new Error('Failed to fetch vehicle owner');
      }
    },
    reviews: async (parent, { first }) => {
      try {
        const Review = require('../models/Review');
        let query = Review.find({ booking: { $in: await getVehicleBookingIds(parent.id) } })
          .populate('user')
          .populate('booking');
        
        if (first) {
          query = query.limit(first);
        }
        
        return await query.sort({ createdAt: -1 });
      } catch (error) {
        throw new Error('Failed to fetch vehicle reviews');
      }
    },
  },
};

// Helper function to get booking IDs for a vehicle
async function getVehicleBookingIds(vehicleId) {
  const Booking = require('../models/Booking');
  const bookings = await Booking.find({ vehicle: vehicleId }).select('_id');
  return bookings.map(booking => booking._id);
}

module.exports = vehicleResolvers;
