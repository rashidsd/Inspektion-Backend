import sequelize from "../../database/db_config";
import { DataTypes, Model } from "sequelize";

class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    role_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    group_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "roles",
    createdAt: false,
    updatedAt: false,
  }
);

export default Role;
