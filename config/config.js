const fs = require('fs');
const path = require('path');

require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 27288, // Default MySQL port
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true, // Set this to `true` if your certificate is valid and authorized
        ca: fs.readFileSync(path.resolve(__dirname, 'ca.pem'))
      },
    },
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_TEST,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 27288,
    dialect: process.env.DB_DIALECT || 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
};
