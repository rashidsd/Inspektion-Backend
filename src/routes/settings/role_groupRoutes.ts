import role_groupController from "../../controllers/settings/role_groupController";
import { Router } from "express";

const router = Router();
router.post("/", role_groupController.createRoleGrop);
router.put("/", role_groupController.updateRoleGroup);
router.get("/", role_groupController.allRoleGroups);

router.get(
  "/roleGroupForSelection",
  role_groupController.roleGroupForSelection
);
router.delete("/:id", role_groupController.deleteRoleGroup);

export default router;
