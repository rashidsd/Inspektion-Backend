import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";
import Vendor_Contact from "./vendor_contacts";
class Vendor extends Model {}

Vendor.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    company: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    web: DataTypes.TEXT,
    address: DataTypes.TEXT,
    file_name: DataTypes.TEXT,
    source: DataTypes.TEXT,
    payment_terms: DataTypes.TEXT,
    payment_days: DataTypes.INTEGER,

  },
  {
    sequelize,
    tableName: "vendors",
    createdAt: false,
    updatedAt: false,
  }
);

Vendor.hasMany(Vendor_Contact, {
  foreignKey: { name: "vendor_id" },
  onDelete: "CASCADE",
  as: "contacts",
});
Vendor_Contact.belongsTo(Vendor, {
  foreignKey: { name: "vendor_id" },
  onDelete: "CASCADE",
});

export default Vendor;
