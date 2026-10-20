import loginController from "../controllers/loginController";
import { Router } from "express";

const router = Router();

router.post("/", loginController.Login);

export default router;
