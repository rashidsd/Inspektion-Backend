import { Router } from "express";
import shipDataController from "../controllers/shipDataController";

const router = Router();
router.post("/", shipDataController.create);
router.put("/updatePaymentStatusAndRemarks", shipDataController.updatePaymentStatusAndRemarks);
router.put("/updateShipDataByShipNo", shipDataController.updateShipDataByShipNo);
router.put("/updateRemarks", shipDataController.updateRemarks);
router.put("/changeShipmentStatus", shipDataController.changeShipmentStatus);
router.put("/updateShipField", shipDataController.updateShipField);
router.get("/paymentData/:client_id/:fromDate/:toDate/:close", shipDataController.paymentData);
router.get(
  "/articleSelection/:order_no",
  shipDataController.articleSelectionForShipData
);
router.get("/:fromDate/:toDate", shipDataController.findAll);
router.get(
  "/byClientAndVendor/:client_id/:vendor_id",
  shipDataController.findByClientAndVendor
);
router.get("/:client_id/:fromDate/:toDate/:openClose", shipDataController.findAllByClient);
router.delete("/:id", shipDataController.deleteShipData);

export default router;
