import roleController from "../../controllers/settings/roleController";
import { Router } from "express";

const router = Router();

router.post("/", roleController.createRole);
router.get("/", roleController.allRoles);
router.get("/byGroupId/:id", roleController.rolesByGroupId);
router.put("/", roleController.updateRole);
router.delete("/:id", roleController.deleteRole);

export default router;
