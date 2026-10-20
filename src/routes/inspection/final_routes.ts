import finalController from "../../controllers/inspection/final_controller";
import { Router } from "express";

const router = Router();

router.post("/", finalController.saveInspection);
router.put("/", finalController.updateInspection);
router.put("/inspectionDetail", finalController.updateInspectionDetail);

router.get(
  "/inspectionResults/:inspection_no",
  finalController.getInspectionResults
);

router.get("/:client_id/:vendor_id", finalController.getPOs);
router.get(
  "/inspectionDetail/:order_no/:inspection_no",
  finalController.getInspectionInfo
);
router.get(
  "/inspectionList/:from_date/:to_date",
  finalController.inspectionList
);
router.get("/:inspection_no", finalController.getInspectionMaster);
router.post("/inspectionResults", finalController.saveInspectionResults);

export default router;
