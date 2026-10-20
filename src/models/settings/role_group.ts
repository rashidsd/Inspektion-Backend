import sequelize from "../../database/db_config";
import { DataTypes, Model } from "sequelize";
import Role from "./role";

class RoleGroup extends Model {}

RoleGroup.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    group_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    descr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "role_group",
    createdAt: false,
    updatedAt: false,
  }
);

RoleGroup.hasMany(Role, {
  foreignKey: "group_id",
  as: "roles",
  onDelete: "CASCADE",
});

Role.belongsTo(RoleGroup, {
  foreignKey: "group_id",
});

export default RoleGroup;
