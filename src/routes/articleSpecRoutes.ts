import articleSpecController from "../controllers/articleSpecController";
import upload_art_iamge from "../middleWares/upload_art_iamge";
import process_art_image from "../middleWares/process_art_image";
import { Router } from "express";

const router = Router();
router.post(
  "/",
  upload_art_iamge,
  process_art_image,
  articleSpecController.createArticleSpec
);

router.get("/:article_id", articleSpecController.findByArticleId);
router.delete("/:id", articleSpecController.deleteArticleSpec);

export default router;
