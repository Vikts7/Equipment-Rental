module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define("Equipment", {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    condition: {
      type: DataTypes.ENUM("new", "used", "repair"),
      defaultValue: "new",
    },
  });
  return Equipment;
};
