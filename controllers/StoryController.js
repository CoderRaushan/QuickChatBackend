import Story from "../models/StoryModel.js";
export const createStory = async (req, res) => {
    try {
        const { mediaType, mediaUrl, caption } = req.body;
        if (!mediaType || !mediaUrl) {
            return res.status(400).json({ success: false, message: "Media type and URL are required." });
        }
        const author = req.id;
        const newStory = new Story({ author, mediaType, mediaUrl, caption });
        await newStory.save();
        res.status(201).json({ success: true, message: "Story uploaded successfully.", story: newStory });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getUserStories = async (req, res) => {
    try {
        const { userId } = req.params;
        const stories = await Story.find({ author: userId })
            .populate("author", "name username profilePicture")
            .populate("viewers", "name username profilePicture")
            .sort({ createdAt: 1 });
        res.status(201).json({ success: true, message: "User stories fetched successfully.", stories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const viewStory = async (req, res) => {
    try {
        const { storyId } = req.params;
        const userId = req.user._id;
        const story = await Story.findById(storyId)
            .populate("author", "name username profilePicture")
            .populate("viewers", "name username profilePicture");
        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found." });
        }
        if (!story.viewers.includes(userId)) {
            story.viewers.push(userId);
            await story.save();
        }
        
        res.status(200).json({ success: true, message: "Story viewed successfully.", story });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

};
