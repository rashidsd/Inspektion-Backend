import Brand from "../models/brand";
import Client from "../models/client";
import { Transaction, QueryTypes } from "sequelize";
import sequelize from "../database/db_config";

type BrandType = {
  id?: string;
  name: string;
  client_id: string;
  descr: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Brand.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class BrandService {
  static async createBrand(obj: BrandType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id;
      await Brand.create({ ...obj }, { transaction: t });
      await t.commit();
      return await Brand.findByPk(obj.id, { include: Client });
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async allBrands() {
    return await Brand.findAll({ include: Client });
  }

  static async BrandById(id: string) {
    return await Brand.findByPk(id);
  }

  static async BrandByName(name: string) {
    return await Brand.findOne({ where: { name }, include: Client });
  }

  static async BrandByClient(clientId: string) {
    return await Brand.findAll({
      where: { client_id: clientId },
      attributes: ["id", "name"],
    });
  }

  static async updateBrand(obj: BrandType) {
    const found = await Brand.findByPk(obj.id);
    if (found) {
      const { id, ...rest } = obj;
      await found.update({ ...rest });
    }
    return found;
  }

  static async deleteBrand(id: string) {
    const found = await Brand.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }
}

export default BrandService;
