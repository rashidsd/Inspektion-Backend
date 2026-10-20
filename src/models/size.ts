import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Size extends Model {}

Size.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    size_name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    descr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sr_no: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: "sizes",
    createdAt: false,
    updatedAt: false,
  }
);

export default Size;
