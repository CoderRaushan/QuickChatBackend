import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
//add new post
export const AddNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const PostPicture = req.file.path;
    const author = req.id;
    if (!caption || PostPicture || author) {
      return res.status(400).json({
        message: "Please fill in all fields",
        success: false
      });
    }
    const post = await Post.create
      ({
        caption,
        image: PostPicture,
        author,
      });
    await post.populate({ path: 'author', select: "-password" })
    const user = User.findById(author);
    if (user) {
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
//getall posts
export const GetAllPosts = async (req, res) => {
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
//getuserposts
export const GetUserPost = async (req, res) => {
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
//like post
export const LikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }
    // Like logic
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
    await post.save();
    // Implement socket.io for real-time notification (if needed)

    return res.status(200).json({
      message: 'Post liked!',
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
//dislike
export const DisLikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }
    // Like logic
    await post.updateOne({ $pull:{ likes: likeKrneWalaUserKiId } });
    await post.save();
    // Implement socket.io for real-time notification (if needed)

    return res.status(200).json({
      message: 'Post disliked!',
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
//add comments
export const AddComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentKrneWalaUserKiId = req.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({
        message: 'Text is required',
        success: false
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }

    const comment = await Comment.create({
      text,
      author: commentKrneWalaUserKiId,
      post: postId
    });

    await comment.populate({ path: 'author', select: 'username profilePicture' }).execPopulate();

    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      message: 'Comment added successfully',
      success: true,
      comment
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
//comments of each post
export const GetCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId })
    .populate('author', 'username profilePicture');

    if (!comments || comments.length === 0) {
      return res.status(404).json({
        message: 'No comments found for this post',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      comments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
//delete post
export const DeletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }

    // Check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({
        message: 'You can not delete this post you are not author of this post!',
        success: false
      });
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Remove the post id from the user's posts
    const user = await User.findById(authorId);
    user.posts = user.posts.filter(id => id.toString() !== postId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: 'Post deleted'
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
//post add to bookmark or unsave the post
export const BookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }

    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      // Already bookmarked - remove from the bookmark
      await user.updateOne({$pull:{bookmarks:post._id}});
      await user.save();
      return res.status(200).json({
        message: 'Post removed from bookmark',
        success: true
      });
    }
    // Bookmark the post
    await user.updateOne({$addToSet:{bookmarks:post._id}});
    await user.save();
    return res.status(200).json({
      type: 'saved',
      message: 'Post bookmarked',
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};