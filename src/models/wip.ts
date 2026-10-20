import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Wip extends Model {}

Wip.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    brand: DataTypes.STRING,
    vendor: DataTypes.STRING,
    po_no: DataTypes.STRING,
    po_date: DataTypes.DATE,
    style_name: DataTypes.STRING,
    units_order: DataTypes.INTEGER,
    material_order_date: { type: DataTypes.DATE, allowNull: true },
    material_inhouse_date: { type: DataTypes.DATE, allowNull: true },
    sample_start_date: { type: DataTypes.DATE, allowNull: true },
    sample_send_date: { type: DataTypes.DATE, allowNull: true },
    sample_approval_date: { type: DataTypes.DATE, allowNull: true },
    production_start_date: { type: DataTypes.DATE, allowNull: true },
    top_send_date: { type: DataTypes.DATE, allowNull: true },
    off_line_date: { type: DataTypes.DATE, allowNull: true },
    finish_packing_date: { type: DataTypes.DATE, allowNull: true },
    qa_complete_date: { type: DataTypes.DATE, allowNull: true },
    estimated_xfactory_date: { type: DataTypes.DATE, allowNull: true },
    units_per_day: DataTypes.INTEGER,
    completed_units_as_per_date: DataTypes.INTEGER,
    vendor_remarks: DataTypes.STRING,
    client_remarks: DataTypes.STRING,
    shiped_qty: DataTypes.INTEGER,
    client_id: DataTypes.TEXT,
    vendor_id: DataTypes.TEXT,
    dated: { type: DataTypes.DATE, allowNull: true },
    approved_xfactory_date: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, tableName: "wip_data", createdAt: false, updatedAt: false }
);

export default Wip;
