import ParentArticle from "../models/parent_article";
import sequelize from "../database/db_config";
import { QueryTypes, Transaction } from "sequelize";
import Article from "../models/article";

type ParentArticleType = {
  id?: string;
  art_name: string;
  hero: boolean;
  client_id: string;
  category: string;
  brand_id: string;
  uom: string;
  genre: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${ParentArticle.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class ParentArticleService {
  static async getAll() {
    return await sequelize.query(
      "select a.id,art_name,category,a.genre,brand_id,b.name as brand,uom,a.client_id,c.name as client,a.hero from parent_articles a left join clients c on a.client_id=c.id left join brands b on b.id=a.brand_id",
      {
        type: QueryTypes.SELECT,
      }
    );
  }

  static async getAllByClientId(client_id: string) {
    try {
      const response = await ParentArticle.findAll({
        where: { client_id },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async getById(id: string) {
    return await sequelize.query(
      "select a.id,art_name,category,a.genre,brand_id,b.name as brand,uom,a.client_id,c.name as client,a.hero from parent_articles a left join clients c on a.client_id=c.id left join brands b on b.id=a.brand_id where a.id=:id",
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );
  }

  static async hasChild(id: string) {
    try {
      const found = await Article.findOne({
        where: { parent_id: id },
      });
      return found ? true : false;
    } catch (error) {
      console.log(error);
    }
  }
  static create = async (obj: ParentArticleType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id;
      await ParentArticle.create({ ...obj }, { transaction: t });
      await t.commit();
      return obj;
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static async update(data: ParentArticleType) {
    try {
      return await ParentArticle.update(data, {
        where: { id: data.id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(id: string) {
    try {
      return await ParentArticle.destroy({
        where: { id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  static async updateHero(id: string, is_hero: boolean) {
    try {
      return await ParentArticle.update({ hero: is_hero }, { where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  static async uploadParentArticles(parentArticles: ParentArticleType[]) {
    try {
      const promises: any = [];
      for (const parentArticle of parentArticles) {
        const { id, ...rest } = parentArticle;
        const found = await ParentArticle.findByPk(id);
        if (found) {
          promises.push(found.update({ ...rest }));
        } else {
          promises.push(ParentArticle.create({ ...parentArticle }));
        }
      }
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}

export default ParentArticleService;
