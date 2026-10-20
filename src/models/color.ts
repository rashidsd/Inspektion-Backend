import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Color extends Model {}

Color.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    color_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    descr: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    sequelize,
    tableName: "colors",
    createdAt: false,
    updatedAt: false,
  }
);

export default Color;
