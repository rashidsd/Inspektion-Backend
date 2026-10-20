import { Transaction, QueryTypes } from "sequelize";
import sequelize from "../../database/db_config";
import FinalInspection from "../../models/inspection/final_inspection";
import FinalInspectionDetail from "../../models/inspection/final_inspection_detail";
import InspectionPictureService from "./inspection_pictureService";
import InspectionResults from "../../models/inspection/inspection_results";

type inspectionResults = {
  id?: number;
  inspection_no: string;
  descr: string;
  workmanship: string;
  confirmity: string;
  measurment: string;
  test: string;
  packing: string;
};

type finalInspection = {
  id?: string;
  dated: string;
  client_id: string;
  vendor_id: string;
  po_no: string;
  po_date: string;
  factory_order_no?: string;
  inspection_type: string;
  order_qty: number;
  packed_qty: number;
  presented_qty: number;
  carton_qty: number;
  article_with_colors: string;
  reference_sample?: string;
  factory_cooporation?: string;
  factory_organization?: string;
  inspection_room: string;
  inspection_team_opinion?: string;
  inspector_name?: string;
  prepared_by?: string;
  verified_by?: string;
  approved_by?: string;
  remarks?: string;
  order_no?: string;
  result_summary?: string;
  article_colors?: string;
};

type finalInspectionDetail = {
  id?: string;
  order_no: string;
  article: string;
  color: string;
  descr: string;
  size: string;
  qty: number;
  inspection_no: string;
};

const getId = async (t: Transaction) => {
  const id = await sequelize.query(
    `select trim(to_char(coalesce( max(cast(id as int)),0)+1,'000')) as id from ${FinalInspection.tableName}`,
    {
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  return id;
};

class FinalService {
  static async saveInspectionMaster(inspection: finalInspection) {
    const t = await sequelize.transaction();
    try {
      const id: any = await getId(t);
      inspection.id = id[0]?.id;
      await FinalInspection.create({ ...inspection }, { transaction: t });
      await t.commit();
      return inspection.id;
    } catch (error) {
      await t.rollback();
      console.log(error);
    }
  }
  static async updateInspectionMaster(inspection: finalInspectionDetail) {
    try {
      const { id, ...rest } = inspection;
      const response = await FinalInspection.update(
        { ...rest },
        { where: { id } }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async updateInspectionDetail(detail: finalInspectionDetail[]) {
    try {
      const record_to_delete = detail.filter(
        (d) => d.qty === undefined || d.qty === null
      );
      console.log(record_to_delete, "record to delete");
      const record_to_update = detail.filter(
        (d) => d.qty !== 0 && d.qty !== null
      );
      const t = await sequelize.transaction();

      const promisesDelete: any[] = [];
      for (const d of record_to_delete) {
        promisesDelete.push(
          FinalInspectionDetail.destroy({
            where: {
              descr: d.descr,
              order_no: d.order_no,
              article: d.article,
              color: d.color,
              size: d.size,
            },
            transaction: t,
          })
        );
      }
      await Promise.all(promisesDelete);

      const promieses: any[] = [];
      for (const d of record_to_update) {
        const found = await FinalInspectionDetail.findOne({
          where: {
            descr: d.descr,
            order_no: d.order_no,
            article: d.article,
            color: d.color,
            size: d.size,
          },
        });
        if (found) {
          promieses.push(
            FinalInspectionDetail.update(
              { qty: d.qty },
              {
                where: {
                  descr: d.descr,
                  order_no: d.order_no,
                  article: d.article,
                  color: d.color,
                  size: d.size,
                },
                transaction: t,
              }
            )
          );
        } else {
          promieses.push(FinalInspectionDetail.create(d, { transaction: t }));
        }
      }
      await Promise.all(promieses);
      await t.commit();
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  static async inspectionList(from_date: string, to_date: string) {
    try {
      const response = await sequelize.query(
        "select i.id,dated,client_id,c.name as client_name,vendor_id,v.name as vendor_name,po_no,i.order_no from final_inspection i left join clients c on i.client_id=c.id left join vendors v on i.vendor_id=v.id where dated between :from_date AND :to_date",
        { replacements: { from_date, to_date }, type: QueryTypes.SELECT }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async getInspectionMaster(id: string) {
    try {
      const response = await sequelize.query(
        "select i.id,dated,client_id,c.name as client_name,vendor_id,v.name as vendor_name,po_no,po_date,factory_order_no,inspection_type,order_qty,packed_qty,presented_qty,carton_qty,article_with_colors,reference_sample,factory_cooporation,factory_organization,inspection_room,inspection_team_opinion,inspector_name,prepared_by,verified_by,approved_by,remarks,order_no,i.result_summary,i.article_colors from final_inspection i left join vendors v on i.vendor_id=v.id left join clients c on i.client_id=c.id where i.id=:id",
        { replacements: { id }, type: QueryTypes.SELECT }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  static async getArticleInfo(order_no: string) {
    const data = await sequelize.query(
      "SELECT Distinct ART_NAME,COLOR FROM ORDER_DETAIL D LEFT JOIN ARTICLES A ON D.ARTICLE_ID = A.ID LEFT JOIN SIZES S ON A.SIZE=S.SIZE_NAME WHERE ORDER_NO =:order_no",
      { replacements: { order_no }, type: QueryTypes.SELECT }
    );
    return data;
  }

  static async getPOs(client_id: string, vendor_id: string) {
    try {
      const response = await sequelize.query(
        "select order_no,client_order_no,dated from order_master where client_id=:client_id and vendor_id=:vendor_id",
        { replacements: { client_id, vendor_id }, type: QueryTypes.SELECT }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  static async articleInfoString(order_no: string) {
    const data: any = await sequelize.query(
      "SELECT Distinct ART_NAME FROM ORDER_DETAIL D LEFT JOIN ARTICLES A ON D.ARTICLE_ID = A.ID LEFT JOIN SIZES S ON A.SIZE=S.SIZE_NAME WHERE ORDER_NO =:order_no",
      { replacements: { order_no }, type: QueryTypes.SELECT }
    );

    const result = data.map((item: any) => item.art_name).join("\n");
    return result;
  }

  static async colorInfoString(articles: any) {
    const result = articles
      .filter(
        (item: any, index: number, self: any) =>
          self.findIndex((t: any) => t.art_name === item.art_name) === index
      )
      .map((item: any) => {
        return {
          colors: articles
            .filter((t: any) => t.art_name === item.art_name)
            .map((t: any) => t.color)
            .join(", "),
        };
      })
      .map((item: any) => item.colors)
      .join("\n");
    return result;
  }

  static async getInspectionInfo(order_no: string, inspection_no: string) {
    try {
      const inspectionMaster = await this.getInspectionMaster(inspection_no);
      const article_info = await this.getArticleInfo(order_no);
      const article_info_string = await this.articleInfoString(order_no);
      const color_info_string = await this.colorInfoString(article_info);
      const inspection_detail = await this.getInspectionDetails(
        order_no,
        inspection_no
      );
      const defect_summary = await this.getDefectSummary(inspection_no);
      const articles_in_order = await this.articlesInOrder(order_no);
      const inspectionResults = await this.getInspectionResults(inspection_no);
      const ArticleSmallPictures =
        await InspectionPictureService.getInspectionArticleImages(
          inspection_no,
          order_no,
          "small"
        );
      const ArticeMediumPictures =
        await InspectionPictureService.getInspectionArticleImages(
          inspection_no,
          order_no,
          "medium"
        );
      const ArticeLargePictures =
        await InspectionPictureService.getInspectionArticleImages(
          inspection_no,
          order_no,
          "large"
        );

      const OrderSmallPictures =
        await InspectionPictureService.getInspectionOrderImages(
          inspection_no,
          order_no,
          "small"
        );
      const OrderMediumPictures =
        await InspectionPictureService.getInspectionOrderImages(
          inspection_no,
          order_no,
          "medium"
        );
      const OrderLargePictures =
        await InspectionPictureService.getInspectionOrderImages(
          inspection_no,
          order_no,
          "large"
        );

      return {
        inspectionMaster: inspectionMaster ? inspectionMaster[0] : {},
        article_info,
        article_info_string,
        color_info_string,
        inspection_detail,
        defect_summary,
        articles_in_order,
        inspectionResults,

        ArticleImages: {
          small: ArticleSmallPictures,
          medium: ArticeMediumPictures,
          large: ArticeLargePictures,
        },
        OrderImages: {
          small: OrderSmallPictures,
          medium: OrderMediumPictures,
          large: OrderLargePictures,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  static async getDefectSummary(inspection_no: string) {
    try {
      const data = await sequelize.query(
        "select inspection_no,a.category,article,color,size,defect_position,detail,frequency,action,sr_no as size_sr_no from inspection_order_analysis a left join sizes s on a.size=s.size_name where inspection_no=:inspection_no",
        { replacements: { inspection_no }, type: QueryTypes.SELECT }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async articlesInOrder(order_no: string) {
    try {
      const data = await sequelize.query(
        "select distinct art_name from order_detail d left join articles a on d.article_id= a.id where d.order_no=:order_no",
        { replacements: { order_no }, type: QueryTypes.SELECT }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  static async getInspectionDetails(order_no: string, inspection_no: string) {
    try {
      const data = await sequelize.query(
        "select * from fn_inspection_detail(:order_no,:inspection_no)",
        { replacements: { order_no, inspection_no }, type: QueryTypes.SELECT }
      );

      const inspection_detail = data
        .filter(
          (obj: any, index: number, self: any) =>
            index ===
            self.findIndex(
              (t: any) =>
                t.art_name === obj.art_name &&
                t.color === obj.color &&
                t.descr === obj.descr
            )
        )
        .map((obj: any) => {
          const sizes = data
            .filter(
              (d: any) =>
                d.art_name === obj.art_name &&
                d.color === obj.color &&
                d.descr === obj.descr
            )
            .map((d: any) => {
              return { size: d.size, qty: d.qty, sr_no: d.size_sr_no };
            });
          return {
            descr: obj.descr,
            art_name: obj.art_name,
            color: obj.color,
            size_detail: [...sizes],
          };
        });
      return inspection_detail;
    } catch (error) {
      console.log(error);
    }
  }

  static async isResultExist(inspection_no: string, descr: string) {
    try {
      const found = await InspectionResults.findOne({
        where: {
          inspection_no,
          descr,
        },
      });
      if (found) return true;
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  static async saveInspectionResults(results: inspectionResults) {
    try {
      const response = await this.isResultExist(
        results.inspection_no,
        results.descr
      );
      if (response) {
        const result = await InspectionResults.update(
          { ...results },
          {
            where: {
              inspection_no: results.inspection_no,
              descr: results.descr,
            },
          }
        );
        return result;
      } else {
        const { id, ...rest } = results;
        const result = await InspectionResults.create({ ...rest });
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  }

  static async getInspectionResults(inspection_no: string) {
    try {
      const response = await InspectionResults.findAll({
        where: { inspection_no },
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default FinalService;
