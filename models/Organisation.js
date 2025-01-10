const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Organisation = sequelize.define(
  "organisation",
  {
    orgId: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    description: {
      allowNull: false,
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
module.exports = { Organisation };
