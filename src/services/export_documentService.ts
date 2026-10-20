import ExportDocuments from "../models/export_documents";
import { QueryTypes,col,fn,where } from "sequelize";
import fs from 'fs';
import path from "path";

type ExportDocumentType = { 
    id?: number;
    shipping_no:string,
    descr: string;
    orignal_name: string;
    stored_name: string;
    stored_path: string;
    file_extension: string;
    created_at?: Date;
}



class ExportDocumentService {
    static async createExportDocument(data: ExportDocumentType) {
        try {
            const newDocument = await ExportDocuments.create(data);
            return newDocument;
        } catch (error) {
            throw new Error(`Error creating export document: ${error}`);
        }
    }
    static async getExportDocumentByShippingNo(shipping_no: string) {
        try {
          
            const document = await ExportDocuments.findAll({ where: where(fn('LOWER', col('shipping_no')), shipping_no.toLowerCase().trim()) ,
            type: QueryTypes.SELECT});
            return document;
        } catch (error) {
            throw new Error(`Error fetching export document by shipping number: ${error}`);
        }
}
    
    static async deleteExportDocument(id: number) {
        try {
            const doc:any = await ExportDocuments.findOne({ where: { id } });
            if (doc) {
                const filePath =  path.join(path.resolve(), "public",doc.stored_path);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file at ${filePath}:`, err);
                        throw new Error(`Error deleting file: ${err}`);
                    } 
                });
            }
             const deleted = await ExportDocuments.destroy({
                where: { id },
            });
            return deleted;
        } catch (error) {
            throw new Error(`Error deleting export document: ${error}`);
        }
    }
}

export default ExportDocumentService;