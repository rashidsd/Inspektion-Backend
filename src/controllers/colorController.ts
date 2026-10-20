import { Request, Response } from "express";
import colorService from "../services/color_service";

const createColor = async (req: Request, res: Response) => {
  try {
    const color = await colorService.findByName(req.body.color_name);

    if (color.length > 0) {
      res.status(400).send({ status: false, msg: "color already exists" });
    } else {
      await colorService.createColor({ ...req.body });
      res.status(201).send({ status: true, msg: "color created" });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allColors = async (req: Request, res: Response) => {
  try {
    const response = await colorService.allColors();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const getColorsForSelection = async (req: Request, res: Response) => {
  try {
    const response = await colorService.getColorsForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await colorService.findById(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const deleteColor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await colorService.deleteColor(id);
    res.send({ status: true, msg: "color deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const updateColor = async (req: Request, res: Response) => {
  try {
    const response = await colorService.updateColor({ ...req.body });
    res.send({ status: true, msg: "color updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

const uploadColors = async (req: Request, res: Response) => {
  try {
    const response = await colorService.uploadColors(req.body);
    res.send({ status: true, msg: "colore are uploaded", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error?.errors[0]?.messsage });
  }
};

export default {
  createColor,
  allColors,
  updateColor,
  findById,
  deleteColor,
  getColorsForSelection,
  uploadColors,
};
