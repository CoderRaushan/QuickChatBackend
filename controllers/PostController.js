import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";

export const AddNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const PostPicture = req.file.path;
        const author = req.id;
        if (!caption || PostPicture || author) 
        {
            return res.status(400).json({
                message: "Please fill in all fields",
                success: false
            });
        }
        const post = await Post.create
        ({
            caption,
            image:PostPicture,
            author,
        });
        await post.populate({path:'author',select:"-password"})
        const user=User.findById(author);
        if(user)
        {
            user.posts.push(post._id);
            await user.save();
            res.status(201).json({
                message: "Post created successfully",
                success: true,
                post
            });
        }  
    } catch (error) {
        res.status(500).json
            ({
                message: "internal server error!",
            })
    }
};

export const getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .populate({ path: 'author', select: 'username profilePicture' })
        .populate({ path: 'comments', populate: { path: 'author', select: 'username profilePicture' } })
        .sort({ createdAt: -1 });
  
      return res.status(200).json({
        posts,
        success: true
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error!",
        success: false
      });
    }
  };
  export const getUserPost = async (req, res) => {
    try {
      const authorId = req.id;
      const posts = await Post.find({ author: authorId })
        .populate({ path: 'author', select: 'username profilePicture' })
        .populate({ path: 'comments', populate: { path: 'author', select: 'username profilePicture' } })
        .sort({ createdAt: -1 });
  
      return res.status(200).json({
        posts,
        success: true
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error!",
        success: false
      });
    }
  };