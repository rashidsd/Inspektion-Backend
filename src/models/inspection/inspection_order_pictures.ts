import { Model, DataTypes } from "sequelize";
import sequelize from "../../database/db_config";

class InspectionOrderPictures extends Model {}

InspectionOrderPictures.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      autoIncrement: true,
    },
    inspection_no: DataTypes.TEXT,
    order_no: DataTypes.TEXT,
    customer_order_no: DataTypes.TEXT,
    article: DataTypes.TEXT,
    color: DataTypes.TEXT,
    remarks: DataTypes.TEXT,
    file_name: DataTypes.TEXT,
    ext: DataTypes.TEXT,
    priority: DataTypes.INTEGER,
    image_size: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "inspection_order_pictures",
  }
);

export default InspectionOrderPictures;
