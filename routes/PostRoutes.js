import express from 'express';
import isAuthenticated from '../middlewares/IsAuther.js';
import {upload} from '../CloudConfig/Cloudinary.js';
import 
{
    AddComment,AddNewPost,BookmarkPost,
    DisLikePost,GetAllPosts,GetUserPost,
    LikePost,GetCommentsOfPost, DeletePost,
    specificpost,
    GetAllExploreVideoPosts
} 
from '../controllers/PostController.js';

const router = express.Router();
// router.route('/add').post(isAuthenticated,upload.single('image'), AddNewPost);
router.route('/add').post(isAuthenticated, AddNewPost);
router.route('/all').get(GetAllPosts);
router.route('/userpost/all').get(isAuthenticated, GetUserPost);
router.route('/get/specificpost/:id').get(isAuthenticated, specificpost);
router.route('/:id/like').get(isAuthenticated, LikePost);
router.route('/:id/dislike').get(isAuthenticated, DisLikePost);
router.route('/:id/comment').post(isAuthenticated, AddComment);
router.route('/:id/comment/all').get(isAuthenticated, GetCommentsOfPost);
router.route('/delete/:id').delete(isAuthenticated, DeletePost);
router.route('/:id/bookmark').post(isAuthenticated, BookmarkPost);
router.route('/explore/videos').get(GetAllExploreVideoPosts);

export default router;