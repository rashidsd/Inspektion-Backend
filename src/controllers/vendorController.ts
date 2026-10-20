import VendorService from "../services/vendor_service";
import { Request, Response } from "express";
import OrderService from "../services/order_service";

const createVendor = async (req: Request, res: Response) => {
  try {
    const dupliateName = await VendorService.findByName(
      req.body.dataObject.name
    );
    if (dupliateName.length > 0) {
      res.send({ status: false, msg: "Name already exists" });
      return;
    } else {
      const response = await VendorService.createVendor({
        ...req.body.dataObject,
      });
      res
        .status(201)
        .send({ status: true, msg: "vendor created", data: response });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allVendors = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.allVendors();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getVendorsForSelection = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.getVendorsForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await VendorService.findById(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteVendor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const vendor = await OrderService.findByVendor(id);
    if (vendor) {
      res.status(400).send({ status: true, msg: "Vendor is in use" });
      return;
    }
    const response = await VendorService.deleteVendor(id);
    res.send({ status: true, msg: "vendor deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateVendor = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.updateVendor({
      ...req.body.dataObject,
    });
    res.send({ status: true, msg: "vendor updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const addVendorContact = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.addVendorContact({ ...req.body });
    res
      .status(201)
      .send({ status: true, msg: "contact created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteVendorContact = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const response = await VendorService.deleteVendorContact(id);
    res.send({ status: true, msg: "contact deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const vendorContactsById = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.vendorContactsById(
      req.params.vendorId
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateVendorContact = async (req: Request, res: Response) => {
  try {
    const response = await VendorService.updateVendorContact({ ...req.body });
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createVendor,
  allVendors,
  findById,
  deleteVendor,
  updateVendor,
  addVendorContact,
  deleteVendorContact,
  vendorContactsById,
  updateVendorContact,
  getVendorsForSelection,
};
