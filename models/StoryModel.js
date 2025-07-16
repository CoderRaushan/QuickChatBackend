import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mediaType: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    viewers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: '24h',
    },
},{tiemstamps: true}); 

const Story = mongoose.model("Story", storySchema);

export default Story;