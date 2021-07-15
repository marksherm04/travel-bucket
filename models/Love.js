const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Love extends Model {}

Love.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		// need code
	},
	{
		sequelize,
		timestamps: false,
		freezeTableName: true,
		underscored: true,
		modelName: 'love'
	}
); 

module.exports = Love;