import { resourceLimits } from "worker_threads";
import sizeController from "../controllers/sizeController";
import express from "express";

const router = express.Router();

router.post("/", sizeController.creteSize);
router.get("/", sizeController.allSizes);
router.get("/sizeForSelection", sizeController.getSizesForSelection);
router.get("/:id", sizeController.findById);
router.delete("/:id", sizeController.deleteSize);
router.put("/", sizeController.updateSize);
router.post("/uploadSizes", sizeController.uploadSizes);

export default router;
