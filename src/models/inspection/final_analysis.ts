import { Model, DataTypes, Transaction, QueryTypes } from "sequelize";
import sequelize from "../../database/db_config";

class FinalAnalysis extends Model {}

FinalAnalysis.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },

    inspection_no: DataTypes.TEXT,
    category: DataTypes.TEXT,
    article: DataTypes.TEXT,
    color: DataTypes.TEXT,
    size: DataTypes.TEXT,
    defect_position: DataTypes.TEXT,
    detail: DataTypes.TEXT,
    frequency: DataTypes.NUMBER,
    action: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "inspection_order_analysis",
  }
);

export default FinalAnalysis;
