import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Vendor_Contact extends Model {}

Vendor_Contact.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    vendor_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contact_person: DataTypes.TEXT,
    designation: DataTypes.TEXT,
    contact_no: DataTypes.TEXT,
    email: DataTypes.TEXT,
  },
  {
    sequelize: sequelize,
    tableName: "vendor_contacts",
    createdAt: false,
    updatedAt: false,
  }
);

export default Vendor_Contact;
