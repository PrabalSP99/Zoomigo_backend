const mongoose = require('mongoose');

const vehicleOwnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
vehicleOwnerSchema.index({ email: 1 });
vehicleOwnerSchema.index({ mobile: 1 });

module.exports = mongoose.model('VehicleOwner', vehicleOwnerSchema);
