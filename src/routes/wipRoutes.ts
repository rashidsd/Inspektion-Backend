import wipController from "../controllers/wipController";
import { Router } from "express";
const router = Router();

router.post("/", wipController.createWip);
router.get("/:client_id", wipController.getClientWip);

router.get("/:client_id/:vendor_id", wipController.getVendorWip);

export default router;
