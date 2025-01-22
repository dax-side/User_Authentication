// {
//   "development": {
//     "username": "root",
//     "password": "ADEADE2004**ade",
//     "database": "user_authentication",
//     "host": "localhost",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }
require('dotenv').config(); // Load environment variables from .env

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: null, // Add a test DB password if needed
    database: 'database_test',
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: null, // Add a production DB password if needed
    database: 'database_production',
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
