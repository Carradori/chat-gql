"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: {
						args: true,
						msg: "must be a valid email address",
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			picture: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "User",
			tableName: "users",
			timestamps: true,
		}
	);
	return User;
};
