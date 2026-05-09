
// models/userQueries.js - PostgreSQL User Queries
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const userQueries = {
  // Create user
  async createUser(input) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    
    const query = `
      INSERT INTO users (name, email, password_hash, phone, dob)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      input.name,
      input.email,
      hashedPassword,
      input.phone || null,
      input.DOB || null
    ]);
    
    return this.formatUser(result.rows[0]);
  },
  
  // Get user by email
  async getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  },
  
  // Get user by ID
  async getUserById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.formatUser(result.rows[0]);
  },
  
  // Verify password
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },
  
  // Format user data
  formatUser(row) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      DOB: row.dob,
      createdAt: row.created_at
    };
  }
};

module.exports = userQueries;
