import ExportDocumentService from "../services/export_documentService";
import { Request, Response } from "express";

const createExportDocument = async (req: Request, res: Response) => {
    try {
        const data = req.body.data;
      
        const newDocument = await ExportDocumentService.createExportDocument(data);
        res.status(201).json({ status: true, data: newDocument });
    } catch (error:any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const getExportDocumentByShippingNo = async (req: Request, res: Response) => {
    try {
        const { shipping_no } = req.params;
        const document = await ExportDocumentService.getExportDocumentByShippingNo(shipping_no);
        if (document) {
            res.status(200).json({ status: true, data: document });
        } else {
            res.status(404).json({ status: false, message: "Document not found" });
        }
    } catch (error:any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const deleteExportDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await ExportDocumentService.deleteExportDocument(Number(id));
        if (deleted) {
            res.status(200).json({ status: true, message: "Document deleted successfully" });
        } else {
            res.status(404).json({ status: false, message: "Document not found" });
        }
    } catch (error:any) {
        res.status(500).json({ status: false, message: error.message });
    }
}

export default { createExportDocument, getExportDocumentByShippingNo, deleteExportDocument };           