import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db_config";

class ExportDocuments extends Model {}

ExportDocuments.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    shipping_no: {
      type: DataTypes.STRING(50),
    },
    descr: {
      type: DataTypes.STRING(100),
    },
    orignal_name: {
      type: DataTypes.STRING(50),
    },
    stored_name: {
      type: DataTypes.STRING(100),
    },
    stored_path: {
      type: DataTypes.TEXT,
    },
    file_extension: {
      type: DataTypes.STRING(5),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "export_documents",
    timestamps: false,
  }
);



export default ExportDocuments;