import inspection_pictureController from "../../controllers/inspection/inspection_pictureController";
import uploadInspectionImage from "../../middleWares/upload_inspection_images";
import process_image from "../../middleWares/process_image";
import { Router } from "express";

const router = Router();
router.post(
  "/",
  uploadInspectionImage,
  process_image,
  inspection_pictureController.addInspectionPicture
);
router.get("/:order_no", inspection_pictureController.findByOrderNo);
router.get("/all/:order_no", inspection_pictureController.findAllArticles);
router.get("/:order_no/:article", inspection_pictureController.findByArticle);
router.delete("/:id", inspection_pictureController.deletePicture);
router.put("/", inspection_pictureController.updateRemarks);

export default router;
