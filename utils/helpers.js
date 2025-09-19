const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const calculateBookingAmount = (startTime, endTime, pricing) => {
  const durationInHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
  const durationInDays = durationInHours / 24;
  const durationInWeeks = durationInDays / 7;
  
  // Calculate based on available pricing options
  if (durationInWeeks >= 1 && pricing.perWeek) {
    return Math.ceil(durationInWeeks) * pricing.perWeek;
  } else if (durationInDays >= 1 && pricing.perDay) {
    return Math.ceil(durationInDays) * pricing.perDay;
  } else if (pricing.perHour) {
    return Math.ceil(durationInHours) * pricing.perHour;
  } else {
    // Fallback to perHour if no other pricing is available
    return Math.ceil(durationInHours) * 25; // Default hourly rate
  }
};

const validateBookingTime = (startTime, endTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  if (start <= now) {
    throw new Error('Start time must be in the future');
  }
  
  if (end <= start) {
    throw new Error('End time must be after start time');
  }
  
  return true;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  calculateBookingAmount,
  validateBookingTime
};
