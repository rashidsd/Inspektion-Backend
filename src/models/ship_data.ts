import sequelize from "../database/db_config";
import { Model, DataTypes } from "sequelize";

class ShipData extends Model {}

ShipData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: DataTypes.STRING,
    vendor_id: DataTypes.STRING,
    order_no: DataTypes.STRING,
    client_order_no: DataTypes.STRING,
    article_id: DataTypes.STRING,
    color: DataTypes.STRING,
    size: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    amount: DataTypes.DECIMAL,
    ship_type: DataTypes.STRING,
    ship_no: DataTypes.STRING,
    ship_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: DataTypes.STRING,
    bl_no: DataTypes.STRING,
    bl_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    tableName: "ship_data",
    underscored: true,
    timestamps: false,
  }
);

export default ShipData;
