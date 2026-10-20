import express from "express";
import path from "path";
import colorController from "../controllers/colorController";



const router = express.Router();

router.post("/", colorController.createColor);
router.get("/", colorController.allColors);
router.get("/ColorsForSelection", colorController.getColorsForSelection);
router.get("/:id", colorController.findById);
router.delete("/:id", colorController.deleteColor);
router.put("/", colorController.updateColor);
router.post("/uploadColors", colorController.uploadColors);

export default router;
