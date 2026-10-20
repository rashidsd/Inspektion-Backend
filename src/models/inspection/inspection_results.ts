import sequelize from "../../database/db_config";
import { Model, DataTypes } from "sequelize";

class InspectionResults extends Model {}
InspectionResults.init(
  {
    id: {
      type: DataTypes.NUMBER,
      primaryKey: true,
      autoIncrement: true,
    },

    inspection_no: DataTypes.STRING,

    descr: DataTypes.STRING,
    workmanship: DataTypes.STRING,
    confirmity: DataTypes.STRING,
    measurment: DataTypes.STRING,
    test: DataTypes.STRING,
    packing: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "inspection_order_results",
    createdAt: false,
    updatedAt: false,
  }
);

export default InspectionResults;
