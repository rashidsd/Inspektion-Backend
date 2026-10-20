import { Request, Response } from "express";
import ArticleSpecService from "../services/article_SpecService";

async function createArticleSpec(req: Request, res: Response) {
  try {
    const data = await ArticleSpecService.createArticleSpec(req.body.art_image);
    res
      .status(201)
      .send({ status: true, msg: "article specification created", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}
async function findById(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data = await ArticleSpecService.findById(id);
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}
async function findByArticleId(req: Request, res: Response) {
  try {
    const article_id = req.params.article_id;
    const data = await ArticleSpecService.findByArticleId(article_id);
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

async function deleteArticleSpec(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const data = await ArticleSpecService.deleteArticleSpec(id);
    res.send({
      status: true,
      msg: "article specification deleted",
      data: data,
    });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}
export default {
  createArticleSpec,
  findById,
  findByArticleId,

  deleteArticleSpec,
};
