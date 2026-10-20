import { QueryTypes, Transaction } from "sequelize";
import sequelize from "../database/db_config";
import Size from "../models/size";

type sizeCreateType = {
  id?: string;
  size_name: string;
  category?: string;
  descr?: string;
  sr_no?: number;
};

type sizeUpdateType = {
  id: string;
  category?: string;
  descr?: string;
  sr_no?: number;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Size.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class SizeService {
  static createSize = async (obj: sizeCreateType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id;
      await Size.create({ ...obj }, { transaction: t });
      await t.commit();
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static async allSizes() {
    return await Size.findAll();
  }

  static async getSizesForSelection() {
    return await Size.findAll({ attributes: ["id", "size_name"] });
  }

  static async findById(id: string) {
    return await Size.findByPk(id);
  }

  static findByName = async (size_name: string) => {
    return await Size.findAll({
      where: { size_name },
      type: QueryTypes.SELECT,
    });
  };

  static async deleteSize(id: string) {
    const found = await Size.findByPk(id);
    if (found) {
      found.destroy();
    }
    return found;
  }

  static async updateSize(obj: sizeUpdateType) {
    const found = await Size.findByPk(obj.id);
    await found?.update({
      category: obj.category,
      descr: obj.descr,
      sr_no: obj.sr_no,
    });
    await found?.save();
    return found;
  }

  static uploadSizes = async (sizes: sizeCreateType[]) => {
    try {
      return await Size.bulkCreate(sizes, { ignoreDuplicates: true });
    } catch (error) {
      console.log(error);
    }
  };
}

export default SizeService;
