import { Request, Response } from "express";
import InspectionPictureService from "../../services/inspections/inspection_pictureService";

async function addInspectionPicture(req: Request, res: Response) {
  try {
    const data = await InspectionPictureService.addInspectionPicture(
      req.body.processObj
    );
    res
      .status(201)
      .send({ status: true, msg: "picture uploaded successfully", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}
async function findByOrderNo(req: Request, res: Response) {
  try {
    const order_no = req.params.order_no;
    const data = await InspectionPictureService.findByOrder(order_no);
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

async function updateRemarks(req: Request, res: Response) {
  try {
    const data = await InspectionPictureService.updateRemarks(req.body);
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

async function findAllArticles(req: Request, res: Response) {
  try {
    const order_no = req.params.order_no;
    const data = await InspectionPictureService.findAllArticles(order_no);
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

async function findByArticle(req: Request, res: Response) {
  try {
    const { order_no, article } = req.params;
    const data = await InspectionPictureService.findByArticle(
      order_no,
      article
    );
    res.send({ status: true, msg: "ok", data: data });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

async function deletePicture(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id);
    const response = await InspectionPictureService.deletePicture(id);
    res.send({
      status: true,
      msg: "picture deleted",
      data: response,
    });
  } catch (error: any) {
    res.send({ status: false, msg: error.message });
  }
}

export default {
  addInspectionPicture,
  findByOrderNo,
  deletePicture,
  findByArticle,
  findAllArticles,
  updateRemarks,
};
