import inspector_controller from "../controllers/inspector_controller";

import { Router } from "express";

const router = Router();
router.post("/", inspector_controller.createInspector);
router.get("/", inspector_controller.getAllInspectors);
router.get("/:id", inspector_controller.getInspectorById);
router.put("/", inspector_controller.updateInspector);
router.delete("/:id", inspector_controller.deleteInspector);

export default router;
