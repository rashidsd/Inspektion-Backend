import SizeService from "../services/size_service";
import { Request, Response } from "express";

const creteSize = async (req: Request, res: Response) => {
  try {
    const size = await SizeService.findByName(req.body.size_name);
    if (size.length > 0) {
      res.send({ status: true, msg: "size already exists" });
      return;
    } else {
      const response = await SizeService.createSize({ ...req.body });
      res.send({ status: true, msg: "size created", data: response });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allSizes = async (req: Request, res: Response) => {
  try {
    const response = await SizeService.allSizes();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getSizesForSelection = async (req: Request, res: Response) => {
  try {
    const response = await SizeService.getSizesForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await SizeService.findById(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteSize = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await SizeService.deleteSize(id);
    res.send({ status: true, msg: "size deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateSize = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await SizeService.updateSize({ ...req.body });
    res.send({ status: true, msg: "size updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const uploadSizes = async (req: Request, res: Response) => {
  try {
    const response = await SizeService.uploadSizes(req.body);
    res.send({ status: true, msg: "sizes are uploaded", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  creteSize,
  allSizes,
  findById,
  deleteSize,
  updateSize,
  getSizesForSelection,
  uploadSizes,
};
