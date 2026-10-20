import Category from "../models/category";
import { Transaction, QueryTypes } from "sequelize";
import sequelize from "../database/db_config";

type categoryType = {
  id?: string;
  name: string;
  descr: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${Category.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class CategoryService {
  static async createCategory(obj: categoryType) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id;
      await Category.create({ ...obj }, { transaction: t });
      await t.commit();
      return await Category.findByPk(obj.id);
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }

  static async allCategories() {
    return await Category.findAll();
  }

  static async categoryById(id: string) {
    return await Category.findByPk(id);
  }

  static async categoryByName(name: string) {
    return await Category.findOne({ where: { name } });
  }

  static async ctegoriesForSelection() {
    return await Category.findAll({ attributes: ["id", "name"] });
  }

  static async findById(id: string) {
    return await Category.findByPk(id);
  }

  static async updateCategory(obj: categoryType) {
    const found = await Category.findByPk(obj.id);
    if (found) {
      const { id, ...rest } = obj;
      await found.update({ ...rest });
    }
    return found;
  }

  static async deleteCategory(id: string) {
    const found = await Category.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }
  static async uploadCategories(categories: categoryType[]) {
    try {
      return await Category.bulkCreate(categories, { ignoreDuplicates: true });
    } catch (error) {
      console.log(error);
    }
  }
}

export default CategoryService;
