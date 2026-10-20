import InspectorService from "../services/inspector_service";
import { Request, Response } from "express";

const createInspector = async (req: Request, res: Response) => {
  try {
    const inspector = req.body;
    const newInspector = await InspectorService.createInspector(inspector);
    res.status(201).send({
      status: true,
      message: "Inspector created successfully",
      data: newInspector,
    });
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: "Error creating inspector",
      error: error.message,
    });
  }
};

const getAllInspectors = async (req: Request, res: Response) => {
  try {
    const inspectors = await InspectorService.getAllInspectors();
    res.status(200).send({
      status: true,
      message: "Inspectors fetched successfully",
      data: inspectors,
    });
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: "Error fetching inspectors",
      error: error.message,
    });
  }
};

const getInspectorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const inspector = await InspectorService.getInspectorById(id);
    if (inspector) {
      res.status(200).send({
        status: true,
        message: "Inspector fetched successfully",
        data: inspector,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Inspector not found",
      });
    }
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: "Error fetching inspector",
      error: error.message,
    });
  }
};
const updateInspector = async (req: Request, res: Response) => {
  try {
    const inspector = req.body;
    const updatedInspector = await InspectorService.updateInspector(inspector);
    if (updatedInspector) {
      res.status(200).send({
        status: true,
        message: "Inspector updated successfully",
        data: updatedInspector,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Inspector not found",
      });
    }
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: "Error updating inspector",
      error: error.message,
    });
  }
};

const deleteInspector = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedInspector = await InspectorService.deleteInspector(id);
    if (deletedInspector) {
      res.status(200).send({
        status: true,
        message: "Inspector deleted successfully",
        data: deletedInspector,
      });
    } else {
      res.status(404).send({
        status: false,
        message: "Inspector not found",
      });
    }
  } catch (error: any) {
    res.status(500).send({
      status: false,
      message: "Error deleting inspector",
      error: error.message,
    });
  }
};
export default {
  createInspector,
  getAllInspectors,
  getInspectorById,
  updateInspector,
  deleteInspector,
};
