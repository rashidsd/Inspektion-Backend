import { QueryTypes, Transaction } from "sequelize";
import sequelize from "../database/db_config";
import Color from "../models/color";

type colorCreateType = {
  id?: string;
  color_name: string;
  code?: string;
  descr?: string;
};

type colorUpdateType = {
  id: string;
  code?: string;
  descr?: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Color.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class ColorService {
  static createColor = async (obj: colorCreateType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id;
      await Color.create({ ...obj }, { transaction: t });
      await t.commit();
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static allColors = async () => {
    return await Color.findAll();
  };

  static getColorsForSelection = async () => {
    return await Color.findAll({ attributes: ["id", "color_name"] });
  };

  static findById = async (id: string) => {
    return await Color.findByPk(id);
  };

  static findByName = async (color_name: string) => {
    return await Color.findAll({
      where: { color_name },
      type: QueryTypes.SELECT,
    });
  };

  static deleteColor = async (id: string) => {
    const found = await Color.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  };

  static updateColor = async (obj: colorUpdateType) => {
    const found: any = await Color.findByPk(obj.id);
    if (found) {
      await found.update({ code: obj.code, descr: obj.descr });
      await found.save();
      return found;
    } else {
      return null;
    }
  };

  static uploadColors = async (colors: colorCreateType[]) => {
    try {
      return await Color.bulkCreate(colors, { ignoreDuplicates: true });
    } catch (error) {
      console.log(error);
    }
  };
}

export default ColorService;
