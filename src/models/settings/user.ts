import sequelize from "../../database/db_config";
import { DataTypes, Model } from "sequelize";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: DataTypes.BOOLEAN,
    user_type: DataTypes.STRING,
    client_id: DataTypes.STRING,
    vendor_id: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "users",
    createdAt: false,
    updatedAt: false,
  }
);

export default User;
