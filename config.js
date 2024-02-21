// config.js
// Configuration file for the E-Commerce Website Development project

module.exports = {
  // JWT secret key for signing the tokens
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key_here',
  
  // Database connection information
  db: {
    uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/ecommerce',
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
  },
};
