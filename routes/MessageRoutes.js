import express from 'express';
import isAuthenticated from '../middlewares/IsAuther.js';
import { GetMessage, GetUploadURL, startConversation } from '../controllers/MessageController.js';
// import { upload } from "../CloudConfig/Cloudinary.js";
const router = express.Router();

router.post('/conversations/bulk-start', isAuthenticated, startConversation);
// router.post('/send/:id', isAuthenticated, SendMessage);
router.post('/get-upload-url', isAuthenticated, GetUploadURL);
// router.post('/file/send/:id', isAuthenticated, SendFile);
// router.post('/file/send/:id', isAuthenticated,upload.single("file"), SendFile);
// router.get('/all/:id', isAuthenticated, GetMessage);

router.get('/:conversationId', isAuthenticated, GetMessage);
export default router;