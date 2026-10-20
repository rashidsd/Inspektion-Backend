import BrandService from "../services/brand_service";
import { Request, Response } from "express";
import ClientService from "../services/client_service";
import ArticleService from "../services/article_service";

const createBrand = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.findById(req.body.client_id);
    if (!client) {
      res.status(400).send({ status: false, msg: "invalid client" });
      return;
    }
    const response = await BrandService.createBrand(req.body);
    res.status(201).send({ status: true, msg: "created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateBrand = async (req: Request, res: Response) => {
  try {
    const client = await ClientService.findById(req.body.client_id);
    if (!client) {
      res.status(400).send({ status: false, msg: "invalid client" });
      return;
    }
    const response = await BrandService.updateBrand(req.body);
    res.send({ status: true, msg: "brand updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allBrands = async (req: Request, res: Response) => {
  try {
    const response = await BrandService.allBrands();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const response = await BrandService.BrandById(req.params.id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const brandByClient = async (req: Request, res: Response) => {
  try {
    const response = await BrandService.BrandByClient(req.params.clientId);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteBrand = async (req: Request, res: Response) => {
  try {
    const articles = await ArticleService.findById(req.params.id);
    if (articles) {
      res.status(400).send({ status: true, msg: "brand is in use" });
      return;
    }
    const response = await BrandService.deleteBrand(req.params.id);
    res.send({ status: true, msg: "deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createBrand,
  updateBrand,
  deleteBrand,
  allBrands,
  findById,
  brandByClient,
};
