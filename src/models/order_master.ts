import sequelize from "../database/db_config";
import { DataTypes, Model } from "sequelize";
import OrderDetail from "./order_detail";

class OrderMaster extends Model {}

OrderMaster.init(
  {
    order_no: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },

    dated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    client_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ship_date: {
      type: DataTypes.DATE,
    },

    vendor_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    client_order_no: { type: DataTypes.TEXT, allowNull: false },

    vendor_order_no: DataTypes.TEXT,
    remarks: DataTypes.TEXT,
    close: { type: DataTypes.BOOLEAN, defaultValue: false },
    ship_type: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ship_country: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ship_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reference: DataTypes.TEXT,
  },

  {
    sequelize,
    tableName: "order_master",
    createdAt: false,
    updatedAt: false,
  }
);

OrderMaster.hasMany(OrderDetail, {
  foreignKey: { name: "order_no" },
  onDelete: "CASCADE",
  as: "order_detail",
});
OrderDetail.belongsTo(OrderMaster, {
  foreignKey: { name: "order_no" },
});

export default OrderMaster;
