import userController from "../../controllers/settings/userController";
import express from "express";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/userForSelection", userController.getUsersForSelection);
router.get("/:id", userController.getUserById);
router.put("/", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.put("/changePassword", userController.changePassword);

export default router;
