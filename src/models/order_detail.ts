import sequelize from "../database/db_config";
import { DataTypes, Model } from "sequelize";

class OrderDetail extends Model {}
OrderDetail.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    order_no: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    article_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    qty: { type: DataTypes.INTEGER, allowNull: false },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "order_detail",
    createdAt: false,
    updatedAt: false,
  }
);

export default OrderDetail;
