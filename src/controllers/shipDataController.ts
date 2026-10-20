import { Request, Response } from "express";
import ShipDataService from "../services/ship_Data_service";

const create = async (req: Request, res: Response) => {
  try {
    const response = await ShipDataService.create(req.body);
    res
      .status(201)
      .send({ status: true, msg: "created successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findAll = async (req: Request, res: Response) => {
  try {
    const { fromDate, toDate } = req.params;
    const response = await ShipDataService.findAll(fromDate, toDate);
    res;
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findAllByClient = async (req: Request, res: Response) => {
  try {
    const { client_id, fromDate, toDate , openClose} = req.params;
  
    const response = await ShipDataService.findAllByClient(
      client_id,
      fromDate,
      toDate,
      openClose === 'true'? true : false
    );
    res;
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findByClientAndVendor = async (req: Request, res: Response) => {
  try {
    const { client_id, vendor_id } = req.params;
    const response = await ShipDataService.findAllByClientAndVender(
      client_id,
      vendor_id
    );
    res;
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const articleSelectionForShipData = async (req: Request, res: Response) => {
  try {
    const order_no = req.params.order_no;
    const response = await ShipDataService.articleSelectionForShipData(
      order_no
    );
    res;
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteShipData = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const response = await ShipDataService.delete(id);
    res.send({ status: true, msg: "deleted successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateBlNoAndDate = async (req: Request, res: Response) => {
  try {
    const { ship_no, bl_no, bl_date } = req.body;
    const response = await ShipDataService.updateBlNoAndDate(ship_no, bl_no, bl_date);
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
}

const updateRemarks = async (req: Request, res: Response) => {
  try {
    const { id, remarks } = req.body;
    const response = await ShipDataService.updateRemarks(id, remarks);
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
}

const paymentData = async (req: Request, res: Response) => {
  try {
    const { client_id,fromDate,toDate,close  } = req.params;
    
    const isClose = close === 'true' ? true : false;

    const response = await ShipDataService.paymentData(client_id,fromDate,toDate,isClose);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
}

const updatePaymentStatusAndRemarks = async (req: Request, res: Response) => {
  try {
    const { fieldName, fieldValue, ship_no } = req.body;
   
    const response = await ShipDataService.updatePaymentStatusAndRemarks(fieldName, fieldValue, ship_no);
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    console.error(error);
    res.send({ status: false, msg: error.errors[0].message });
  }
};

  const updateShipDataByShipNo = async (req: Request, res: Response) => {
  try {
    const { ship_no, editShipNo, ship_date, bl_no, bl_date,is_close } = req.body;
    
    const response = await ShipDataService.updateShipDataByShipNo(
      ship_no,
      editShipNo,
      ship_date,
      bl_no,
      bl_date,
      is_close
    );
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    console.error(error);
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const changeShipmentStatus = async (req: Request, res: Response) => {
  try {
    const { ship_no, is_close } = req.body;

    const response = await ShipDataService.changeShipmentStatus(
      ship_no,
      is_close
    );
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    console.error(error);
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateShipField = async (req: Request, res: Response) => {
  try {
    const { ship_no, field, value } = req.body;
    const response = await ShipDataService.updateShipField(ship_no, field, value);
    res.send({ status: true, msg: "updated successfully", data: response });
  } catch (error: any) {
    console.error(error);
    res.send({ status: false, msg: error.message });
  }
};
export default {
  create,
  findAll,
  articleSelectionForShipData,
  deleteShipData,
  findAllByClient,
  findByClientAndVendor,
  updateBlNoAndDate,
  updateRemarks,
  paymentData,
  updatePaymentStatusAndRemarks,
  updateShipDataByShipNo,
  changeShipmentStatus,
  updateShipField
};
