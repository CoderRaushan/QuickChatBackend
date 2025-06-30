import mongoose from "mongoose";
import Comment from "../models/CommentModel.js";
import User from "./UserModel.js";
const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  file: {
    url: String,        
    filename: String,  
    size: Number,       
    mimetype: String 
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Post = mongoose.model("Post", postSchema);
export default Post;
