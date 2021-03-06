// importing Sequelize constructor
const Sequelize = require('sequelize');

require('dotenv').config();

// create database connection and pass in mySQL info
let sequelize;

if (process.env.JAWSDB_URL) {
	sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
	sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER,
		process.env.DB_PW, {
		host: 'localhost',
		dialect: 'mysql',
		port: 3306
	});
}
// hello

module.exports = sequelize;