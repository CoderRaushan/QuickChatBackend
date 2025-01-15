import express from "express";
import { Login, ManualRegister,SendVarificationCodeToUserEmail } from "../controllers/UserController.js";
const router = express.Router();
router.post('/api/SendEmail',SendVarificationCodeToUserEmail);
router.post('/api/register',ManualRegister);
router.post('/api/login',Login);

export default router;