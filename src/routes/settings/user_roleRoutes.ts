import user_roleController from "../../controllers/settings/user_roleController";

import { Router } from "express";

const router = Router();

router.post("/", user_roleController.createUserRole);

router.put("/", user_roleController.updateUserRoles);
router.get("/userRoles/:id", user_roleController.getUserRoles);
router.delete("/:id", user_roleController.deleteUserRole);

export default router;
