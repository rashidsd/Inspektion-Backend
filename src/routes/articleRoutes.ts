import articleController from "../controllers/articleController";
import express from "express";

const router = express.Router();

router.post("/", articleController.createArticle);
router.get("/", articleController.allArticles);
router.get(
  "/articleList/:client_id/:brand_id/:listType",
  articleController.getArticleList
);
router.get("/:id", articleController.findById);
router.get(
  "/articleForOrderSelection/:client_id",
  articleController.getArticlesForOrderSelection
);
router.delete("/:id", articleController.deleteArticle);
router.put("/", articleController.updateArticle);
router.put("/updateSeason", articleController.updateSeason);
router.post("/uploadArticles", articleController.uploadArticles);

export default router;
