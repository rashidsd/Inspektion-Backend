import { Request, Response } from "express";
import ParentArticleService from "../services/parent_article_service";

const create = async (req: Request, res: Response) => {
  try {
    const response: any = await ParentArticleService.create(req.body);
    res
      .status(201)
      .send({ status: true, msg: "create successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    // const hasChild = await ParentArticleService.hasChild(req.body.id);
    // if (hasChild) {
    //   res.send({
    //     status: false,
    //     msg: "This article has child articles. cannot be updated.",
    //   });
    //   return;
    // }

    const response: any = await ParentArticleService.update(req.body);
    res
      .status(200)
      .send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getAll = async (req: Request, res: Response) => {
  try {
    const response = await ParentArticleService.getAll();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateHero = async (req: Request, res: Response) => {
  try {
    const { id, is_hero } = req.body;
    const response = await ParentArticleService.updateHero(id, is_hero);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await ParentArticleService.getById(id);
    res.send({
      status: true,
      msg: "ok",
      data: response?.length ? response[0] : {},
    });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const hasChild = await ParentArticleService.hasChild(id);
    if (hasChild) {
      res.send({
        status: false,
        msg: "This article has child articles. cannot be deleted.",
      });
      return;
    }

    const response = await ParentArticleService.delete(id);
    res.send({ status: true, msg: "deleted successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getAllByClientId = async (req: Request, res: Response) => {
  try {
    const client_id = req.params.client_id;
    const response = await ParentArticleService.getAllByClientId(client_id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const uploadParentArticles = async (req: Request, res: Response) => {
  try {
    const { list } = req.body;
    const response = await ParentArticleService.uploadParentArticles(list);
    res.send({
      status: true,
      msg: "Article uploaded Sccessfully!",
      data: response,
    });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  create,
  update,
  getAll,
  getById,
  deleteById,
  updateHero,
  uploadParentArticles,
  getAllByClientId,
};
