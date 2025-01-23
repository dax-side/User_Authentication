const Sequelize = require('sequelize');
const config = require('./config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]; // Get the configuration for the current environment

// Initialize Sequelize with SSL configuration included
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port, // Include port if needed
    dialect: dbConfig.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allows self-signed or less strict SSL certificates
      },
    },
    logging: dbConfig.logging || false, // Disable logging if specified in config
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
