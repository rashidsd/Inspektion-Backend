import { Model, DataTypes, Transaction, QueryTypes } from "sequelize";
import sequelize from "../database/db_config";

class Brand extends Model {}

Brand.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descr: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "brands",
  }
);

export default Brand;
