import express from 'express';
import isAuthenticated from '../middlewares/IsAuther.js';
import { SendMessage, GetMessage,SendFile } from '../controllers/MessageController.js';
import { upload } from "../CloudConfig/Cloudinary.js";
const router = express.Router();

router.post('/send/:id', isAuthenticated, SendMessage);
router.post('/file/send/:id', isAuthenticated,upload.single("file"), SendFile);
router.get('/all/:id', isAuthenticated, GetMessage);

export default router;