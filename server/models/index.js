const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserModel = require("./User");
const EquipmentModel = require("./Equipment");
const RequestModel = require("./Request");

const User = UserModel(sequelize, DataTypes);
const Equipment = EquipmentModel(sequelize, DataTypes);
const Request = RequestModel(sequelize, DataTypes);

User.hasMany(Request, {
  foreignKey: "user_id",
  as: "requests",
  onDelete: "CASCADE",
});
Request.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Equipment.hasMany(Request, {
  foreignKey: "equipment_id",
  as: "requests",
  onDelete: "CASCADE",
});
Request.belongsTo(Equipment, {
  foreignKey: "equipment_id",
  as: "equipment",
});

module.exports = {
  sequelize,
  User,
  Equipment,
  Request,
};
