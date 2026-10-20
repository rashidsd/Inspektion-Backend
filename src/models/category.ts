import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    descr: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: "categories",
    createdAt: false,
    updatedAt: false,
  }
);

export default Category;
