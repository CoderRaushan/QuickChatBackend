import express from "express";
import { ManualRegister,VarifyEmail } from "../controllers/UserController.js";
const router = express.Router();
router.post('/api/register',ManualRegister);
router.post('/api/varifyemail',VarifyEmail);
export default router;