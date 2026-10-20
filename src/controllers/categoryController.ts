import CategoryService from "../services/category_service";
import { Request, Response } from "express";
import ArticleService from "../services/article_service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await CategoryService.categoryByName(req.body.name);
    if (category) {
      res.status(400).send({ status: false, msg: "Category already exists" });
      return;
    }
    const response = await CategoryService.createCategory({ ...req.body });
    res.status(201).send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allCategories = async (req: Request, res: Response) => {
  try {
    const response = await CategoryService.allCategories();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const categoriesForSelection = async (req: Request, res: Response) => {
  try {
    const response = await CategoryService.ctegoriesForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const response = await CategoryService.findById(req.params.id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const response = await CategoryService.deleteCategory(req.params.id);
    res.send({ status: true, msg: "category deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const articles = await ArticleService.findByCategory(req.body.id);
    if (articles.length > 0) {
      res.status(400).send({ status: false, msg: "Category is in use" });
      return;
    }
    const response = await CategoryService.updateCategory({ ...req.body });
    res.send({ status: true, msg: "category updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const uploadCategories = async (req: Request, res: Response) => {
  try {
    const response = await CategoryService.uploadCategories(req.body);
    res.send({ status: true, msg: "categories uploaded", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createCategory,
  allCategories,
  findById,
  deleteCategory,
  updateCategory,
  categoriesForSelection,
  uploadCategories,
};
