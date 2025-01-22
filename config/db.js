const Sequelize = require('sequelize');
const config = require("./config");

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]; // Get the configuration for the current environment

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
  }
);

(async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
  
  module.exports = { sequelize };
