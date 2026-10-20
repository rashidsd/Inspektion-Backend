import sequelize from "../../database/db_config";
import { Transaction, QueryTypes } from "sequelize";

import Role from "../../models/settings/role";

type roleType = {
  id: string;
  role_name: string;
  descr: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Role.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class RoleService {
  static async createRole(role: roleType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      role.id = id[0]?.id;
      await Role.create({ ...role }, { transaction: t });
      await t.commit();
      return await Role.findByPk(role.id);
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async allRoles() {
    return await sequelize.query(
      "select r.id,role_name,group_id,group_name,r.descr from roles r left join role_group g on r.group_id=g.id",
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  static async roleById(id: string) {
    return await Role.findByPk(id);
  }

  static async rolesByGroupId(id: string) {
    return await sequelize.query(
      "select r.id,role_name,group_id,group_name,r.descr from roles r left join role_group g on r.group_id=g.id Where group_id=:id",
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
  }

  static async updateRole(role: roleType) {
    const found = await Role.findByPk(role.id);
    if (found) {
      const { id, ...rest } = role;
      await Role.update({ ...rest }, { where: { id } });
      return await Role.findByPk(role.id);
    }
  }
  static async deleteRole(id: string) {
    return await Role.destroy({ where: { id } });
  }
}

export default RoleService;
