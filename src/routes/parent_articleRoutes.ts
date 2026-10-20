import { Router } from "express";
import parent_articleController from "../controllers/parent_articleController";

const router = Router();
router.post("/", parent_articleController.create);
router.post(
  "/uploadParentArticles",
  parent_articleController.uploadParentArticles
);
router.put("/", parent_articleController.update);
router.put("/updateHero", parent_articleController.updateHero);
router.get("/", parent_articleController.getAll);
router.get("/:id", parent_articleController.getById);
router.get("/byClient/:client_id", parent_articleController.getAllByClientId);
router.delete("/:id", parent_articleController.deleteById);

export default router;
