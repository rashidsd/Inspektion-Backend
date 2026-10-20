import { Request, response, Response } from "express";
import FinalService from "../../services/inspections/final_service";
import { inspect } from "util";

const getPOs = async (req: Request, res: Response) => {
  try {
    const response = await FinalService.getPOs(
      req.params.client_id,
      req.params.vendor_id
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getInspectionInfo = async (req: Request, res: Response) => {
  try {
    const { order_no, inspection_no } = req.params;

    const response = await FinalService.getInspectionInfo(
      order_no,
      inspection_no
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const inspectionList = async (req: Request, res: Response) => {
  try {
    const { from_date, to_date } = req.params;

    const response = await FinalService.inspectionList(from_date, to_date);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getInspectionMaster = async (req: Request, res: Response) => {
  try {
    const { inspection_no } = req.params;

    const response = await FinalService.getInspectionMaster(inspection_no);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const saveInspection = async (req: Request, res: Response) => {
  try {
    const response = await FinalService.saveInspectionMaster(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateInspection = async (req: Request, res: Response) => {
  try {
    const response = await FinalService.updateInspectionMaster(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateInspectionDetail = async (req: Request, res: Response) => {
  try {
    const response = await FinalService.updateInspectionDetail(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const saveInspectionResults = async (req: Request, res: Response) => {
  try {
    const response = await FinalService.saveInspectionResults(req.body);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getInspectionResults = async (req: Request, res: Response) => {
  try {
    const inspection_no = req.params.inspection_no;
    const response = await FinalService.getInspectionResults(inspection_no);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  getPOs,
  getInspectionInfo,
  saveInspection,
  inspectionList,
  getInspectionMaster,
  updateInspection,
  updateInspectionDetail,
  saveInspectionResults,
  getInspectionResults,
};
