const pool = require('../config/database_pg');

const vehicleOwnerResolvers = {
  Query: {
    vehicleOwners: async () => {
      try {
        const result = await pool.query('SELECT * FROM owners ORDER BY created_at DESC');
        return result.rows;
      } catch (error) {
        throw new Error('Failed to fetch vehicle owners');
      }
    },
    vehicleOwner: async (_, { id }) => {
      try {
        const result = await pool.query('SELECT * FROM owners WHERE id = $1', [id]);
        if (result.rows.length === 0) {
          throw new Error('Vehicle owner not found');
        }
        return result.rows[0];
      } catch (error) {
        throw new Error('Failed to fetch vehicle owner');
      }
    },
  },
  VehicleOwner: {
    vehicles: async (parent) => {
      try {
        const vehicleQueries = require('../models/vehicleQueries');
        const result = await pool.query('SELECT * FROM vehicles WHERE owner_id = $1', [parent.id]);
        return result.rows.map(row => vehicleQueries.formatVehicle(row));
      } catch (error) {
        return [];
      }
    },
  },
};

module.exports = vehicleOwnerResolvers;
