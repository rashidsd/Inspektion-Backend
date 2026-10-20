import sequelize from "../database/db_config";
import { DataTypes, Model } from "sequelize";

class Inspector extends Model {}

Inspector.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "inspector",
    createdAt: false,
    updatedAt: false,
  }
);

export default Inspector;
