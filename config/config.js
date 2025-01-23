require('dotenv').config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || 'development_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306, // Use DB_PORT here
    dialect: process.env.DB_DIALECT || 'mysql', // Default to 'mysql'
    logging: false, // Disable logging for development
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE_TEST || 'test_db', // Use a separate test DB
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_DATABASE || 'production_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true'
        ? {
            require: true,
            rejectUnauthorized: false, // Allow SSL connections for production
          }
        : false,
    },
    logging: false, // Disable logging in production
  },
};
