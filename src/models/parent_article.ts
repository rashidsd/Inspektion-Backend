import sequelize from "../database/db_config";
import { DataTypes, Model } from "sequelize";

class ParentArticle extends Model {}

ParentArticle.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    art_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hero: DataTypes.BOOLEAN,
    client_id: DataTypes.STRING,
    category: DataTypes.STRING,
    brand_id: DataTypes.STRING,
    uom: DataTypes.STRING,
    genre: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "parent_articles",
    timestamps: false,
    updatedAt: false,
  }
);
export default ParentArticle;
