const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "auth_user",
  {
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      },
    },
    phone: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
// sequelize.sync({ alter: true }).then((data) => {
//     console.log('Table and model synced successfully')
// }).catch((err) => {
//     console.log('Error syncing the table and model')
// });
module.exports = { User };
