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

// export const getUserStories = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const stories = await Story.find({ author: userId })
//             .populate("author", "name username profilePicture")
//             .populate("viewers", "name username profilePicture")
//             .sort({ createdAt: 1 });
//         res.status(201).json({ success: true, message: "User stories fetched successfully.", stories });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;
    const stories = await Story.find({ author: userId })
      .populate("author", "name username profilePicture")
      .populate("viewers", "name username profilePicture")
      .populate("likes", "name username profilePicture") // <-- add this
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      message: "User stories fetched successfully.",
      stories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const GetFollowingStories = async (req, res) => {
    const { followings } = req.body;
    try {
        if (!followings || followings.length === 0) {
            return res.status(400).json({ success: false, message: "No followings provided." });
        }
        const stories = await Story.find({
            author: { $in: followings }
        }).sort({ createdAt: -1 }).populate("author", "name username profilePicture");
        res.status(200).json({ success: true, message: "Following stories fetched successfully.", stories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.id;

    const story = await Story.findById(storyId)
      .populate("author", "name username profilePicture")
      .populate("viewers", "name username profilePicture");

    if (!story) {
      return res.status(404).json({
        success: false,
        message: "Story not found.",
      });
    }

    // ✅ Check if the user is already a viewer
    const alreadyViewed = story.viewers.some(
      (viewer) => viewer._id.toString() === userId.toString()
    );

    if (!alreadyViewed) {
      story.viewers.push(userId);
      await story.save();
    } 

    res.status(200).json({
      success: true,
      message: "Story viewed successfully.",
      story,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const LikeStory = async (req, res) => {
    try {
       
        const { storyId } = req.params;
        const userId = req.id;
        const story = await Story.findById(storyId)
            .populate("author", "name username profilePicture")
            .populate("viewers", "name username profilePicture");

        if (!story) {
            return res.status(404).json({ success: false, message: "Story not found." });
        }

        let liked;

        if (!story.likes.map(id => id.toString()).includes(userId.toString())) {
            story.likes.push(userId);
            liked = true;
        } else {
            story.likes.pull(userId);
            liked = false;
        }
        await story.save();
        res.status(200).json({
            success: true,
            message: liked ? "Story liked successfully." : "Story unliked successfully.",
            liked,
            story,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

