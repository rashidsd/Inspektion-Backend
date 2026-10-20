import { QueryTypes, Transaction, where } from "sequelize";
import sequelize from "../database/db_config";
import Article from "../models/article";
import OrderDetail from "../models/order_detail";

type articleType = {
  id?: string;
  client_id: string;
  art_no: string;
  art_name: string;
  category: string;
  brand_id: string;
  descr?: string;
  barcode?: string;
  color: string;
  genre: string;
  uom: string;
  price?: number | null;
  size: string;
  is_hero?: boolean | null;
  parent_id?: string | null;
  season?: string | null;
};
const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'00000')) as id from ${Article.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class ArticleService {
  static createArticle = async (obj: articleType) => {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      obj.id = id[0]?.id.toString().trim();
      await Article.create({ ...obj }, { transaction: t });
      await t.commit();
    } catch (error) {
      t.rollback();
      console.log(error);
    }
  };

  static async allArticles() {
    return await sequelize.query(
      "select articles.id,clients.name as client,brands.name as brand,art_no,art_name,articles.color,articles.size,articles.uom,articles.barcode,articles.price, articles.genre,category,articles.barcode,articles.descr,articles.client_id,brand_id,articles.is_hero,articles.season from articles left join clients on articles.client_id=clients.id left join brands on articles.brand_id= brands.id ",
      { type: QueryTypes.SELECT }
    );
  }

  // static async articleListByArticle(client_id: string, brand_id: string) {
  //   return await sequelize.query(
  //     "select id,art_name,category,uom,genre,hero from  parent_articles where client_id=:client_id and brand_id=:brand_id",
  //     { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
  //   );
  // }

  // static async articleListByColor(client_id: string, brand_id: string) {
  //   return await sequelize.query(
  //     "select distinct p.id,p.art_name,color,season,p.category,p.uom,p.genre,p.hero from  parent_articles p left join articles c on p.id=c.parent_id where p.client_id=:client_id and p.brand_id=:brand_id",
  //     { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
  //   );
  // }

  // static async articleListBySize(client_id: string, brand_id: string) {
  //   return await sequelize.query(
  //     "select p.id,c.id as child_id,p.art_name,color,size,price,season,p.category,p.uom,p.genre,p.hero from  parent_articles p left join articles c on p.id=c.parent_id where p.client_id=:client_id and p.brand_id=:brand_id",
  //     { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
  //   );
  // }

  static async getArticleList(
    client_id: string,
    brand_id: string,
    listType: string
  ) {
    try {
      if (listType === "byArticle") {
        return await sequelize.query(
          "select id,art_name,category,uom,genre,hero from  parent_articles where client_id=:client_id and brand_id=:brand_id",
          { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
        );
      } else if (listType === "byColor") {
        return await sequelize.query(
          "select distinct p.id,p.art_name,color,season,p.category,p.uom,p.genre,p.hero from  parent_articles p left join articles c on p.id=c.parent_id where p.client_id=:client_id and p.brand_id=:brand_id",
          { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
        );
      } else {
        return await sequelize.query(
          "select p.id,c.id as child_id,p.art_name,color,size,price,barcode,season,p.category,p.uom,p.genre,p.hero from  parent_articles p left join articles c on p.id=c.parent_id where p.client_id=:client_id and p.brand_id=:brand_id",
          { replacements: { client_id, brand_id }, type: QueryTypes.SELECT }
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async getArticlesForOrderSelection(client_id: string) {
    return await Article.findAll({
      attributes: [
        ["id", "article_id"],
        "art_no",
        "art_name",
        "color",
        "size",
        "price",
        "barcode",
      ],
      where: { client_id },
    });
  }

  static async findById(id: string) {
    return await sequelize.query(
      " with cte as ( select count(*) as in_use from order_detail where article_id=:id )  select articles.id,clients.name as client,brands.name as brand,art_no,art_name,articles.color ,articles.size,articles.uom,articles.barcode,articles.price, articles.genre,category,articles.barcode,articles.descr,articles.client_id,brand_id,cte.in_use,articles.is_hero,articles.parent_id,articles.season from articles left join clients on articles.client_id=clients.id left join brands on articles.brand_id= brands.id  cross join cte Where articles.id=:id",
      { replacements: { id }, type: QueryTypes.SELECT, plain: true }
    );
  }

  static async findByArtNo(art_no: string) {
    return await Article.findAll({ where: { art_no } });
  }

  static async findByBarcode(barcode: string) {
    try {
      return await Article.findOne({ where: { barcode } });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteArticle(id: string) {
    const found = await Article.findByPk(id);
    if (found) {
      await found.destroy();
    }
    return found;
  }

  static async findByBrand(brand_id: string) {
    return await Article.findAll({ where: { brand_id } });
  }

  static async findByCategory(cat_id: string) {
    return await Article.findAll({ where: { cat_id } });
  }

  static async updateArticle(obj: articleType) {
    try {
      const found = await Article.findByPk(obj.id);
      const inUse = await this.isArticleInUse(obj.id);

      const { id, ...rest } = obj;

      if (found && !inUse) {
        await found.update({ ...rest });
        await found.save();
        return found;
      } else {
        await found?.update({
          descr: obj.descr,
          barcode: obj.barcode,
        });
        await found?.save();
        return found;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async invalidArticles(artnoList: string[], client_id: string) {
    const result = await sequelize.query(
      `select id from ${Article.tableName} where client_id='${client_id}'`,
      {
        type: QueryTypes.SELECT,
      }
    );
    const articles = result.map((article: any) => article.id);
    const invalidArticles = artnoList.filter(
      (value: any) => !articles.includes(value.article_id)
    );
    return invalidArticles;
  }
  static isArticleInUse = async (id: string | undefined) => {
    const found = await OrderDetail.findOne({ where: { article_id: id } });
    return found ? true : false;
  };

  static async uploadArticles(articles: articleType[]) {
    try {
      // return Article.bulkCreate(articles, { ignoreDuplicates: true });
      const t = await sequelize.transaction();
      const promises: any[] = [];
      for (const article of articles) {
        const found = await Article.findOne({
          where: { id: article.id },
          transaction: t,
        });
        if (found) {
          const { id, ...rest } = article;
          promises.push(found.update({ ...rest }, { transaction: t }));
        } else {
          const id: any = await getId(t);
          article.id = id[0]?.id.toString().trim();
          promises.push(Article.create({ ...article }, { transaction: t }));
        }
      }
      await Promise.all(promises);
      await t.commit();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateSeason(parent_id: string, color: string, season: string) {
    try {
      return await Article.update({ season }, { where: { parent_id, color } });
    } catch (error) {
      console.log(error);
    }
  }
}

export default ArticleService;
