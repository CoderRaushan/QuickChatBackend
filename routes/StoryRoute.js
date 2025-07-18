import express from "express";
const router = express.Router();
import {viewStory,getUserStories,createStory, GetFollowingStories,LikeStory} from "../controllers/StoryController.js";
import isAuthenticated from '../middlewares/IsAuther.js';
router.post("/upload", isAuthenticated,createStory);///user/story/upload
router.get("/:userId", isAuthenticated,getUserStories);//user/story/:userId
router.post("/following/stories", isAuthenticated, GetFollowingStories);//user/story/following/stories
router.post("/view/:storyId", isAuthenticated,viewStory);//user/story/:id
router.post("/likeAndDislike/:storyId", isAuthenticated,LikeStory);//user/story/:id

// router.delete("/:id", isAuthenticated,deleteStory);
export default router;