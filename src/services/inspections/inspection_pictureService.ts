import InspectionOrderPictures from "../../models/inspection/inspection_order_pictures";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";
import settings from "../../settings";

type orderInspectionPictureType = {
  id?: string;
  inspection_no: string;
  order_no: string;
  customer_order_no: string;
  article?: string;
  color?: string;
  remarks?: string;
  file_path?: string;
  ext?: string;
  recordType?: string;
  priority?: number;
  image_size: string;
};

const fileUrl =
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.FILE_UPLOAD_URL
    : settings.PRODUCTION_SERVER.FILE_DOWNLOAD_URL;

class InspectionPictureService {
  static async addInspectionPicture(orderInspType: orderInspectionPictureType) {
    const { recordType, ...rest } = orderInspType;
    const response = await InspectionOrderPictures.create(rest);
    if (recordType === "order") {
      const count = (
        await InspectionOrderPictures.findAll({ where: { article: null } })
      ).length;
      return { ...response.toJSON(), count };
    } else if (recordType === "article") {
      const count = (
        await InspectionOrderPictures.findAll({
          where: { article: { [Op.ne]: null } },
        })
      ).length;
      return { ...response.toJSON(), count };
    } else {
      return response;
    }
  }

  static async findById(id: number) {
    return await InspectionOrderPictures.findByPk(id);
  }

  static async findByOrder(order_no: string) {
    const response: any = await InspectionOrderPictures.findAll({
      attributes: ["id", "remarks", "file_name"],
      order: ["priority"],
      where: { order_no, article: null, color: null },
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async getInspectionArticleImages(
    inspection_no: string,
    order_no: string,
    image_size: string
  ) {
    const response: any = await InspectionOrderPictures.findAll({
      attributes: ["id", "article", "color", "remarks", "file_name"],
      order: ["priority"],
      where: {
        inspection_no,
        order_no,
        image_size,
        article: { [Op.ne]: null },
      },
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async getInspectionOrderImages(
    inspection_no: string,
    order_no: string,
    image_size: string
  ) {
    const response: any = await InspectionOrderPictures.findAll({
      attributes: ["id", "article", "color", "remarks", "file_name"],
      order: ["priority"],
      where: {
        inspection_no,
        order_no,
        image_size,
        article: { [Op.eq]: null },
      },
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async findAllArticles(order_no: string) {
    const response: any = await InspectionOrderPictures.findAll({
      attributes: ["id", "article", "color", "remarks", "file_name"],
      where: { order_no, article: { [Op.ne]: null } },
      order: ["priority"],
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async findByArticle(order_no: string, article: string) {
    const response: any = await InspectionOrderPictures.findAll({
      attributes: ["id", "remarks", "file_name"],
      where: { order_no, article, color: null },
      order: ["priority"],
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async findByArticleColor(
    order_no: string,
    article: string,
    color: string
  ) {
    const response: any = await InspectionOrderPictures.findAll({
      where: { order_no, article, color },
    });
    const result = JSON.parse(JSON.stringify(response));
    result.forEach((img: any) => {
      img.url = `${fileUrl}/order_images/${img.file_name}`;
    });
    return result;
  }

  static async updateRemarks(obj: any) {
    try {
      const response = await InspectionOrderPictures.update(
        { remarks: obj.remarks },
        { where: { id: obj.id } }
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  static async deletePicture(id: number) {
    const found: any = await InspectionOrderPictures.findByPk(id);

    if (found) {
      const filePath = path.join(
        path.resolve(),
        `public/order_images/${found?.file_name}`
      );
      fs.unlink(filePath, async (error) => {
        if (error) {
          console.log(error);
        } else {
          await InspectionOrderPictures.destroy({ where: { id } });
        }
      });
    }
    return found;
  }
}

export default InspectionPictureService;
