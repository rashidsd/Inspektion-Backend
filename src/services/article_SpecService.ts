import ArticleSpec from "../models/articleSpec";
import path from "path";
import fs from "fs";
import settings from "../settings";

const fileUrl =
  settings.MODE === "development"
    ? settings.DEVELOPMENT_SERVER.FILE_UPLOAD_URL
    : settings.PRODUCTION_SERVER.FILE_UPLOAD_URL;

type ArticleSpecType = {
  id: number;
  article_id: string;
  descr: string;
  file_name: string;
  ext: string;
};

class ArticleSpecService {
  static async createArticleSpec(imageSpec: ArticleSpecType) {
    return await ArticleSpec.create({ ...imageSpec });
  }

  static async findById(id: number) {
    return await ArticleSpec.findByPk(id);
  }
  static async findByArticleId(article_id: string) {
    const response: any = await ArticleSpec.findAll({ where: { article_id } });
    const specs = JSON.parse(JSON.stringify(response));
    specs.forEach((spec: any) => {
      spec.url = `${fileUrl}/art_images/${spec.file_name}`;
    });
    return specs;
  }
  static async updateArticleSpec(imageSpec: ArticleSpecType) {
    return await ArticleSpec.update(imageSpec, { where: { id: imageSpec.id } });
  }
  static async deleteArticleSpec(id: number) {
    const found: any = await ArticleSpec.findByPk(id);
    if (found) {
      const filePath = path.join(
        path.resolve(),
        `public/art_images/${found?.file_name}`
      );
      fs.unlink(filePath, async (error) => {
        if (error) {
          console.log(error);
        } else {
          await ArticleSpec.destroy({ where: { id } });
          return found;
        }
      });
    }
  }
}

export default ArticleSpecService;
