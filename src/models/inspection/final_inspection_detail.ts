import { Model, DataTypes } from "sequelize";
import sequelize from "../../database/db_config";

class FinalInspectionDetail extends Model {}

FinalInspectionDetail.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_no: DataTypes.TEXT,
    article: DataTypes.TEXT,
    color: DataTypes.TEXT,
    descr: DataTypes.TEXT,
    size: DataTypes.TEXT,
    qty: DataTypes.INTEGER,
    inspection_no: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "order_inspection_info",
  }
);

export default FinalInspectionDetail;
