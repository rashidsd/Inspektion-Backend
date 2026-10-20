import { Request, Response } from "express";
import WipService from "../services/wip_service";

const createWip = async (req: Request, res: Response) => {
  try {
    const response = await WipService.createWip(req.body);
    res.send({ status: true, msg: "created successfully", data: response });
  } catch (error) {
    console.log(error);
    res.send({ status: false, msg: "error occured" });
  }
};

const getVendorWip = async (req: Request, res: Response) => {
  try {
    const { client_id, vendor_id } = req.params;
    const response = await WipService.getVendorWip(client_id, vendor_id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error) {
    console.log(error);
    res.send({ status: false, msg: "error occured" });
  }
};
const getClientWip = async (req: Request, res: Response) => {
  try {
    const { client_id } = req.params;
    const response = await WipService.getClientWip(client_id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error) {
    console.log(error);
    res.send({ status: false, msg: "error occured" });
  }
};

export default { createWip, getVendorWip, getClientWip };
