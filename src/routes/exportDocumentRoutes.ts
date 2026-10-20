import Router from 'express';
import exportDocumentController from '../controllers/exportDocumentController';
import uploadDoc from '../middleWares/export_document';
const router = Router();
import path from 'path';


router.post('/', uploadDoc.single('file'),
(req,res,next)=> {
   
   const url = path.relative(path.resolve(), req?.file?.path || "").replace("public","").replace(/\\/g, "/");
   const originalName = req.file?.originalname;
   req.body.data = {...JSON.parse(req.body.data), stored_path: url, original_name: originalName}
   next();
}
,

 exportDocumentController.createExportDocument);
router.get('/:shipping_no', exportDocumentController.getExportDocumentByShippingNo);
router.delete('/:id', exportDocumentController.deleteExportDocument);






export default router;

