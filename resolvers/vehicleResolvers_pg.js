const vehicleQueries = require('../models/vehicleQueries');

const vehicleResolvers = {
  Query: {
    vehicles: async (_, { filters }) => {
      try {
        const pgFilters = {};
        
        if (filters) {
          if (filters.type) pgFilters.type = filters.type;
          if (filters.brand) pgFilters.brand = filters.brand;
          if (filters.city) pgFilters.city = filters.city;
          if (filters.minPrice) pgFilters.minPrice = filters.minPrice;
          if (filters.maxPrice) pgFilters.maxPrice = filters.maxPrice;
          if (filters.fuelType) pgFilters.fuelType = filters.fuelType;
          if (filters.driveMode) pgFilters.transmission = filters.driveMode;
          if (filters.seats) pgFilters.seats = filters.seats;
          if (filters.featured !== undefined) pgFilters.featured = filters.featured;
          if (filters.sortBy) pgFilters.sortBy = filters.sortBy;
          if (filters.first) pgFilters.first = filters.first;
        }
        
        return await vehicleQueries.getVehicles(pgFilters);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw new Error('Failed to fetch vehicles');
      }
    },
    
    vehicle: async (_, { id }) => {
      try {
        const vehicle = await vehicleQueries.getVehicleById(id);
        if (!vehicle) {
          throw new Error('Vehicle not found');
        }
        return vehicle;
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        throw new Error('Failed to fetch vehicle');
      }
    },
    
    vehiclesByLocation: async (_, { city }) => {
      try {
        return await vehicleQueries.getVehicles({ city });
      } catch (error) {
        throw new Error('Failed to fetch vehicles by location');
      }
    },
    
    vehiclesByType: async (_, { type }) => {
      try {
        return await vehicleQueries.getVehicles({ type });
      } catch (error) {
        throw new Error('Failed to fetch vehicles by type');
      }
    },
    
    availableVehicles: async () => {
      try {
        return await vehicleQueries.getVehicles({});
      } catch (error) {
        throw new Error('Failed to fetch available vehicles');
      }
    },
    
    checkVehicleAvailability: async (_, { vehicleId, startTime, endTime }) => {
      try {
        const available = await vehicleQueries.checkAvailability(vehicleId, startTime, endTime);
        return {
          available,
          conflictingBookings: []
        };
      } catch (error) {
        throw new Error('Failed to check vehicle availability');
      }
    },
  },
  
  Vehicle: {
    owner: async (parent) => {
      // Owner data is already included in the vehicle query
      return parent.owner;
    },
    
    reviews: async (parent, { first }) => {
      // TODO: Implement reviews query
      return [];
    },
  },
};

module.exports = vehicleResolvers;
