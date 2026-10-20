import final_analysisController from "../../controllers/inspection/final_analysisController";
import { Router } from "express";

const router = Router();

router.post("/", final_analysisController.addAnalysis);
router.get("/:inspection_no", final_analysisController.getAnalysis);
router.get(
  "/:inspection_no/:article",
  final_analysisController.getAnalysisByArticle
);
router.get(
  "/:inspection_no/:category/:article/:color/:size",
  final_analysisController.getAnalysisByArticleTypeAnsSize
);
router.delete("/:id", final_analysisController.deleteAnalysis);

export default router;
