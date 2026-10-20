import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";

class Client_Contact extends Model {}

Client_Contact.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
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
    tableName: "client_contacts",
    createdAt: false,
    updatedAt: false,
  }
);

export default Client_Contact;
