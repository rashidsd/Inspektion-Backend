import sequelize from "../../database/db_config";
import { DataTypes, Model } from "sequelize";

class UserRoles extends Model {}

UserRoles.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    roleid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "user_roles",
    createdAt: false,
    updatedAt: false,
  }
);
export default UserRoles;
