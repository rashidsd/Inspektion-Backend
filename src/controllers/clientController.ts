import clientService from "../services/client_service";
import { Request, Response } from "express";
import OrderService from "../services/order_service";

const createClient = async (req: Request, res: Response) => {
  try {
    const foundDuplicate = await clientService.findByName(
      req.body.dataObject.name
    );

    if (foundDuplicate?.length > 0) {
      res.status(400).send({
        status: true,
        msg: "Name already exits",
        data: foundDuplicate,
      });
      return;
    } else {
      const response = await clientService.createClient({
        ...req.body.dataObject,
      });
      res
        .status(201)
        .send({ status: true, msg: "client created", data: response });
    }
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const allClients = async (req: Request, res: Response) => {
  try {
    const response = await clientService.allClients();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const getClientsForSelection = async (req: Request, res: Response) => {
  try {
    const response = await clientService.getClientsForSelection();
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await clientService.findById(id);
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const client: any = await OrderService.findByClient(id);
    if (client) {
      res.status(400).send({ status: false, msg: "Client is in use" });
      return;
    }
    const response = await clientService.deleteClient(id);
    res.send({ status: true, msg: "client deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateClient = async (req: Request, res: Response) => {
  try {
    const response = await clientService.updateClient({
      ...req.body.dataObject,
    });
    res.send({ status: true, msg: "client updated", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const addClientContact = async (req: Request, res: Response) => {
  try {
    const response = await clientService.addClientContact({ ...req.body });
    res.send({ status: true, msg: "client created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteClientContact = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const response = await clientService.deleteClientContact(id);
    res.send({ status: true, msg: "deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const clientContactsById = async (req: Request, res: Response) => {
  try {
    const response = await clientService.clientContactsById(
      req.params.clientId
    );
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateClientContact = async (req: Request, res: Response) => {
  try {
    const response = await clientService.updateClientContact({ ...req.body });
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const addClientBrand = async (req: Request, res: Response) => {
  try {
    const response = await clientService.addClientBrand({ ...req.body });
    res.send({ status: true, msg: "brand created", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const deleteClientBrand = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const response = await clientService.deleteClientBrand(id);
    res.send({ status: true, msg: "brand deleted", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

const updateClientBrand = async (req: Request, res: Response) => {
  try {
    const response = await clientService.updateClientBrand({ ...req.body });
    res.send({ status: true, msg: "ok", data: response });
  } catch (error: any) {
    res.send({ status: false, msg: error.errors[0].message });
  }
};

export default {
  createClient,
  allClients,
  findById,
  deleteClient,
  updateClient,
  addClientContact,
  deleteClientContact,
  clientContactsById,
  updateClientContact,
  addClientBrand,
  deleteClientBrand,
  updateClientBrand,
  getClientsForSelection,
};
