import express from "express";
const router = express.Router();
import {viewStory,getUserStories,createStory} from "../controllers/StoryController.js";
import isAuthenticated from '../middlewares/IsAuther.js';
router.post("/upload", isAuthenticated,createStory);///user/story/upload
router.get("/:userId", isAuthenticated,getUserStories);//user/story/:userId
router.get("/:storyId", isAuthenticated,viewStory);
// router.delete("/:id", isAuthenticated,deleteStory);
export default router;