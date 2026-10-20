import UserRoles from "../../models/settings/user_role";
import sequelize from "../../database/db_config";
import RoleGroup from "../../models/settings/role_group";
import Role from "../../models/settings/role";
import { QueryTypes } from "sequelize";

type userRoleType = {
  id?: string;
  roleid: string;
  groupid: string;
};

type updatedRoleType = {
  id: string;
  roleid: string;
  userid: string;
  is_assigned: boolean;
};
type updatedRolesType = {
  userid: string;
  roles: updatedRoleType[];
};

class UserRoleService {
  static async createUserRole(userRole: userRoleType) {
    try {
      await UserRoles.create({ ...userRole });
      return await UserRoles.findByPk(userRole.id);
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserRoles(userid: string) {
    const userRoles = await UserRoles.findAll({
      where: { userid },
    });
    const roles: any = await RoleGroup.findAll({
      include: { model: Role, as: "roles" },
    });

    roles.forEach((roleGroup: any) => {
      roleGroup.roles.forEach((role: any) => {
        role.setDataValue(
          "is_assigned",
          userRoles.find((userRole: any) => userRole.roleid === role.id)
            ? true
            : false
        );
        role.setDataValue(
          "userid",
          userRoles.find((userRole: any) => userRole.roleid === role.id)
            ? userid
            : ""
        );
      });
    });
    return roles;
  }

  static async updateUserRoles(updatedRoles: updatedRolesType) {
    const promises: any = [];
    const t = await sequelize.transaction();

    updatedRoles.roles.forEach(async (role: any) => {
      if (!role.is_assigned) {
        promises.push(
          UserRoles.destroy({
            where: { userid: updatedRoles.userid, roleid: role.roleid },
            transaction: t,
          })
        );
      } else if (role.userid == "") {
        promises.push(
          UserRoles.create(
            { userid: updatedRoles.userid, roleid: role.roleid },
            { transaction: t }
          )
        );
      }
    });
    await Promise.all(promises);
    await t.commit();
    return await this.getUserRoles(updatedRoles.userid);
  }

  static async findByUserId(id: string) {
    return await sequelize.query(
      "select role_name as role  from user_roles ur left join roles r on ur.roleid = r.id where userid = :userid",
      { replacements: { userid: id }, type: QueryTypes.SELECT }
    );
  }

  static async findByRoleId(id: string) {
    return await UserRoles.findOne({ where: { roleid: id } });
  }
  static async deleteUserRole(id: string) {
    return await UserRoles.destroy({ where: { id } });
  }
}

export default UserRoleService;
