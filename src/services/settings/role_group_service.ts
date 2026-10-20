import sequelize from "../../database/db_config";
import { Transaction, QueryTypes } from "sequelize";
import RoleGroup from "../../models/settings/role_group";

type roleGroupType = {
  id: string;
  group_name: string;
  descr: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${RoleGroup.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class RoleGroupService {
  static async createRoleGroup(roleGroup: roleGroupType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      roleGroup.id = id[0]?.id;
      await RoleGroup.create({ ...roleGroup }, { transaction: t });
      await t.commit();
      return await RoleGroup.findByPk(roleGroup.id);
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async allRoleGroups() {
    return await RoleGroup.findAll();
  }

  static async roleGroupById(id: string) {
    return await RoleGroup.findByPk(id);
  }

  static async roleGroupsForSelection() {
    return await RoleGroup.findAll({
      attributes: ["id", "group_name"],
    });
  }

  static async updateRoleGroup(roleGroup: roleGroupType) {
    const found = await RoleGroup.findByPk(roleGroup.id);
    if (found) {
      const { id, ...rest } = roleGroup;
      await RoleGroup.update({ ...rest }, { where: { id } });
      return await RoleGroup.findByPk(roleGroup.id);
    }
  }
  static async deleteRoleGroup(id: string) {
    return await RoleGroup.destroy({ where: { id } });
  }
}

export default RoleGroupService;
