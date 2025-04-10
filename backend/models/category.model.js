export default (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });
  return Category;
};
