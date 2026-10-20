import { Model, DataTypes } from "sequelize";
import sequelize from "../database/db_config";
import Client_Contact from "./client_contact";
import Brand from "./brand";

class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },
    company: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    web: DataTypes.TEXT,
    address: DataTypes.TEXT,
    file_name: DataTypes.TEXT,
  },
  {
    sequelize,
    tableName: "clients",
    createdAt: false,
    updatedAt: false,
  }
);

Client.hasMany(Client_Contact, {
  foreignKey: { name: "client_id" },
  onDelete: "CASCADE",
  as: "contacts",
});
Client_Contact.belongsTo(Client, {
  foreignKey: { name: "client_id" },
  onDelete: "CASCADE",
});

Client.hasMany(Brand, {
  foreignKey: { name: "client_id" },
  onDelete: "CASCADE",
  as: "brands",
});
Brand.belongsTo(Client, {
  foreignKey: { name: "client_id" },
  onDelete: "CASCADE",
});

export default Client;
