import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Article extends Model {}

Article.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    art_no: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    art_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    brand_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    barcode: DataTypes.TEXT,
    color: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    genre: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    uom: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
    },
    size: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_hero: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    parent_id: DataTypes.TEXT,
    season: DataTypes.TEXT,
  },

  {
    sequelize,
    tableName: "articles",
    createdAt: false,
    updatedAt: false,
  }
);

// Article.hasMany(Category, { foreignKey: { name: "cat_id" } });
// Category.belongsTo(Article, { foreignKey: { name: "cat_id" } });

// Article.hasMany(Brand, { foreignKey: { name: "brand_id" } });
// Brand.belongsTo(Article, { foreignKey: { name: "brand_id" } });

export default Article;
