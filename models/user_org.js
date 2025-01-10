const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const { User } = require("./user_auth");
const { Organisation } = require("./Organisation");
const user_Org = sequelize.define(
  "userorg",
  {
    userOrgId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

User.belongsToMany(Organisation, {
  through: user_Org,
  foreignKey: "userId",
});
Organisation.belongsToMany(User, {
  through: user_Org,
  foreignKey: "orgId",
});
// sequelize.sync({ force: true }).then((data) => {
//     console.log('Table and model synced successfully')
// }).catch((err) => {
//     console.log('Error syncing the table and model')
// });
module.exports = { user_Org };
