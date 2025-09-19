const mongoose = require('mongoose');

const engineSchema = new mongoose.Schema({
  displacement: {
    type: String,
    required: true
  },
  topSpeed: {
    type: String,
    required: true
  },
  fuelCapacity: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  mileage: {
    type: String,
    required: true
  },
  kerbWeight: {
    type: String
  },
  driveMode: {
    type: String,
    enum: ['MANUAL', 'AUTOMATIC'],
    required: true
  },
  fuelType: {
    type: String,
    required: true
  }
});

const pricingSchema = new mongoose.Schema({
  perHour: {
    type: Number,
    min: 0
  },
  perDay: {
    type: Number,
    min: 0
  },
  perWeek: {
    type: Number,
    min: 0
  },
  perKm: {
    type: Number,
    min: 0
  }
});

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  altText: {
    type: String
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  lat: {
    type: Number
  },
  lon: {
    type: Number
  },
  address: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  raw: {
    type: mongoose.Schema.Types.Mixed
  }
});

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['CAR', 'BIKE'],
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleOwner',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  engineSpec: {
    type: engineSchema,
    required: true
  },
  year: {
    type: Number
  },
  licensePlate: {
    type: String,
    trim: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  pricing: {
    type: pricingSchema,
    required: true
  },
  availabilityStatus: {
    type: String,
    enum: ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'],
    default: 'AVAILABLE'
  },
  images: {
    type: [imageSchema],
    required: true,
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
