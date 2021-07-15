// importing Model class and DataTypes from Sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const bcrypt = require('bcrypt');

// create our User model
class User extends Model { }

// define table columns and config
User.init(
	{
		// Datatypes object provides what type of data(Integer), must have input(allownull:false), ID is primary key, auto increment ID number
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		// Datatype is string, must have input(allownull: false)
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// Datatype is string, must have input, must be unique email and validates it is an email that is input
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		// Datatype is string, must have input, password must be at least 8 characters long
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [8, 128]
			}
		}
	},
	{
		hooks: {
			async beforeCreate(newUserData) {
				newUserData.password = await bcrypt.hash(newUserData.password, 10);
				return newUserData;
			},
			async beforeUpdate(updatedUserData) {
				updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
				return updatedUserData;
			}
		},
		// sequelize connection to the DB 
		sequelize,
		// don't auto create timestamps
		timestamps: false,
		// don't pluralize name of database table
		freezeTableName: true,
		// userscore instead of camel-casing
		underscored: true,
		// model name stays lowercase in DB
		modelName: 'user'
	}
);

module.exports = User;