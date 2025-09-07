export default (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtTimeOfPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
    OrderItem.belongsTo(models.Offer, { foreignKey: "offerId" });
  };

  return OrderItem;
};
