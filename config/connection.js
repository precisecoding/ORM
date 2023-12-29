const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        // allows for either server host or port to be used and if not there use 'localhost', '3006'.
        host: process.env.host || 'localhost',
        dialect: 'mysql',
        port: process.env.port || 3306
    }
// method to put host, dialect, port in env file

);

module.exports = sequelize;