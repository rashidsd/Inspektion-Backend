import { Model, DataTypes, Transaction, QueryTypes } from "sequelize";
import sequelize from "../../database/db_config";

class FinalInspection extends Model {}

FinalInspection.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    dated: DataTypes.DATE,
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vendor_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    po_no: DataTypes.TEXT,
    po_date: DataTypes.DATE,
    factory_order_no: DataTypes.TEXT,
    inspection_type: { type: DataTypes.TEXT, defaultValue: "Final Inspection" },
    order_qty: DataTypes.INTEGER,
    packed_qty: DataTypes.INTEGER,
    presented_qty: DataTypes.INTEGER,
    carton_qty: DataTypes.INTEGER,
    article_with_colors: DataTypes.TEXT,
    reference_sample: DataTypes.TEXT,
    factory_cooporation: DataTypes.TEXT,
    factory_organization: DataTypes.TEXT,
    inspection_room: { type: DataTypes.TEXT, defaultValue: "No" },
    inspection_team_opinion: DataTypes.TEXT,
    inspector_name: DataTypes.TEXT,
    prepared_by: DataTypes.TEXT,
    verified_by: DataTypes.TEXT,
    approved_by: DataTypes.TEXT,
    remarks: DataTypes.TEXT,
    order_no: DataTypes.TEXT,
    result_summary: DataTypes.TEXT,
    article_colors: DataTypes.TEXT,
  },
  {
    createdAt: false,
    updatedAt: false,
    sequelize,
    tableName: "final_inspection",
  }
);

export default FinalInspection;
