
// models/vehicleQueries.js - PostgreSQL Vehicle Queries
const pool = require('../config/database');

const vehicleQueries = {
  // Get all vehicles with filters
  async getVehicles(filters = {}) {
    let query = `
      SELECT 
        v.*,
        o.name as owner_name,
        o.email as owner_email,
        o.phone as owner_phone
      FROM vehicles v
      LEFT JOIN owners o ON v.owner_id = o.id
      WHERE v.deleted_at IS NULL
        AND v.available = true
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (filters.city) {
      query += ` AND LOWER(v.city) = LOWER($${paramIndex})`;
      params.push(filters.city);
      paramIndex++;
    }
    
    if (filters.type) {
      query += ` AND v.category = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }
    
    if (filters.minPrice) {
      query += ` AND v.price_per_day >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }
    
    if (filters.maxPrice) {
      query += ` AND v.price_per_day <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }
    
    if (filters.fuelType) {
      query += ` AND LOWER(v.fuel_type) = LOWER($${paramIndex})`;
      params.push(filters.fuelType);
      paramIndex++;
    }
    
    if (filters.transmission) {
      query += ` AND LOWER(v.transmission) = LOWER($${paramIndex})`;
      params.push(filters.transmission);
      paramIndex++;
    }
    
    if (filters.seats) {
      query += ` AND v.seats >= $${paramIndex}`;
      params.push(filters.seats);
      paramIndex++;
    }
    
    if (filters.featured) {
      query += ` AND v.featured = true`;
    }
    
    // Sorting
    if (filters.sortBy === 'PRICE_LOW_TO_HIGH') {
      query += ' ORDER BY v.price_per_day ASC';
    } else if (filters.sortBy === 'PRICE_HIGH_TO_LOW') {
      query += ' ORDER BY v.price_per_day DESC';
    } else {
      query += ' ORDER BY v.created_at DESC';
    }
    
    // Limit
    if (filters.first) {
      query += ` LIMIT $${paramIndex}`;
      params.push(filters.first);
    }
    
    const result = await pool.query(query, params);
    return result.rows.map(row => this.formatVehicle(row));
  },
  
  // Get single vehicle by ID
  async getVehicleById(id) {
    const query = `
      SELECT 
        v.*,
        o.name as owner_name,
        o.email as owner_email,
        o.phone as owner_phone
      FROM vehicles v
      LEFT JOIN owners o ON v.owner_id = o.id
      WHERE v.id = $1 AND v.deleted_at IS NULL
    `;
    
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.formatVehicle(result.rows[0]);
  },
  
  // Format vehicle data to match GraphQL schema
  formatVehicle(row) {
    // Parse additional_images JSON
    let images = [];
    if (row.image_url) {
      images.push({
        url: row.image_url,
        altText: `${row.make} ${row.model}`,
        isPrimary: true
      });
    }
    
    if (row.additional_images) {
      try {
        const additionalUrls = JSON.parse(row.additional_images);
        additionalUrls.forEach(url => {
          images.push({
            url: url,
            altText: `${row.make} ${row.model}`,
            isPrimary: false
          });
        });
      } catch (e) {
        console.error('Error parsing additional_images:', e);
      }
    }
    
    return {
      id: row.id,
      type: row.category || 'CAR',
      brand: row.make,
      model: row.model,
      year: row.year,
      licensePlate: row.license_plate,
      engineSpec: {
        displacement: row.displacement,
        topSpeed: row.top_speed,
        fuelCapacity: row.fuel_capacity,
        seats: row.seats,
        mileage: row.mileage ? `${row.mileage} km/l` : null,
        kerbWeight: row.kerb_weight,
        driveMode: row.transmission === 'Automatic' ? 'AUTOMATIC' : 'MANUAL',
        fuelType: row.fuel_type
      },
      location: {
        city: row.city,
        lat: row.latitude ? parseFloat(row.latitude) : null,
        lon: row.longitude ? parseFloat(row.longitude) : null,
        address: row.address,
        state: row.state,
        country: row.country || 'India'
      },
      pricing: {
        perHour: row.price_per_hour,
        perDay: row.price_per_day,
        perWeek: row.price_per_week
      },
      availabilityStatus: row.available ? 'AVAILABLE' : 'UNAVAILABLE',
      featured: row.featured || false,
      images: images,
      createdAt: row.created_at,
      owner: {
        id: row.owner_id,
        name: row.owner_name,
        email: row.owner_email,
        phone: row.owner_phone
      }
    };
  },
  
  // Check vehicle availability
  async checkAvailability(vehicleId, startTime, endTime) {
    const query = `
      SELECT COUNT(*) as count
      FROM user_bookings
      WHERE vehicle_id = $1
        AND status IN ('PENDING', 'CONFIRMED')
        AND (
          (start_time <= $2 AND end_time >= $2)
          OR (start_time <= $3 AND end_time >= $3)
          OR (start_time >= $2 AND end_time <= $3)
        )
    `;
    
    const result = await pool.query(query, [vehicleId, startTime, endTime]);
    return parseInt(result.rows[0].count) === 0;
  }
};

module.exports = vehicleQueries;
