export default (sequelize, DataTypes) => {
  const Media = sequelize.define("Media", {
    id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
    publicId: { type: DataTypes.STRING, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: false },
    fileType: { type: DataTypes.ENUM("image", "video"), allowNull: false },
    tag: {
      type: DataTypes.ENUM("thumbnail", "gallery"),
      allowNull: false,
      default: "gallery",
    },
    associatedType: {
      type: DataTypes.ENUM("product", "review", "category", "brand"),
      allowNull: false,
    },
    associatedId: { type: DataTypes.INTEGER, allowNull: false },
  });
  return Media;
};
