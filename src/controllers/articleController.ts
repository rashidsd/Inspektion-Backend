import ArticleService from "../services/article_service";
import CustomerService from "../services/client_service";
import BrandService from "../services/brand_service";
import CategoryService from "../services/category_service";
import OrderService from "../services/order_service";
import { Request, Response } from "express";

const createArticle = async (req: Request, res: Response) => {
  try {
    // const article = await ArticleService.findByArtNo(req.body.art_no);
    // if (article.length > 0) {
    //   res.status(400).send({ status: false, msg: "Article already exist" });
    //   return;
    // }
    const { client_id, brand_id, category, barcode } = req.body;
    const article = await ArticleService.findByBarcode(barcode);
    if (article) {
      res.status(400).send({ status: false, msg: "Barcode already exist" });
      return;
    }

    const customer = await CustomerService.findById(client_id);
    if (!customer) {
      res.status(400).send({ status: false, msg: "invalid client" });
      return;
    }

    const brand = await BrandService.BrandById(brand_id);
    if (!brand) {
      res.status(400).send({ status: false, msg: "invalid brnad" });
      return;
    }

    const findcategory: any = await CategoryService.categoryByName(category);
    if (!findcategory) {
      res.status(400).send({ status: false, msg: "invalid category" });
      return;
    }

    const response = await ArticleService.createArticle({ ...req.body });
    res
      .status(201)
      .send({ status: true, msg: "article created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allArticles = async (req: Request, res: Response) => {
  try {
    const response = await ArticleService.allArticles();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getArticleList = async (req: Request, res: Response) => {
  try {
    const { client_id, brand_id, listType } = req.params;
    const response = await ArticleService.getArticleList(
      client_id,
      brand_id,
      listType
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await ArticleService.findById(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getArticlesForOrderSelection = async (req: Request, res: Response) => {
  try {
    const response = await ArticleService.getArticlesForOrderSelection(
      req.params.client_id
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteArticle = async (req: Request, res: Response) => {
  try {
    const isArticleInOrder = await OrderService.isArticleInOrder(req.params.id);
    if (isArticleInOrder) {
      res
        .status(400)
        .send({ status: false, msg: "Article has been used in order" });
      return;
    }

    const response = await ArticleService.deleteArticle(req.params.id);
    res.send({ status: true, msg: "article deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateArticle = async (req: Request, res: Response) => {
  try {
    const response = await ArticleService.updateArticle({ ...req.body });
    res.send({ status: true, msg: "article updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateSeason = async (req: Request, res: Response) => {
  try {
    const { parent_id, color, season } = req.body;
    const response = await ArticleService.updateSeason(
      parent_id,
      color,
      season
    );
    res.send({ status: true, msg: "Season Updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const uploadArticles = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const response = await ArticleService.uploadArticles(req.body);
    res.send({ status: true, msg: "article uploaded", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createArticle,
  allArticles,
  findById,
  deleteArticle,
  updateArticle,
  getArticlesForOrderSelection,
  uploadArticles,
  getArticleList,
  updateSeason,
};
