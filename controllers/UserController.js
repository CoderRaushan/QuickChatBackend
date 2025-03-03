import { WelComeMessage } from "../middlewares/WelComeEmail.js";
import User from "../models/UserModel.js";
import VerificationCode from "../models/VerificationCodeModel.js"
import { SendVarificationCode } from "../middlewares/VarifyEmail.js";
import jwtTokenFunction from "../Jwt/JwtToken.js";
import Post from "../models/PostModel.js";

export const SendVarificationCodeToUserEmail = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    // Generate verification code
    const VarCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Save verification code to the database
    const NewVerificationCode = new VerificationCode({
      email: email,
      VerfiCode: VarCode,
    });
    await NewVerificationCode.save();
    await SendVarificationCode(email, VarCode);
    res.status(201).json({
      message: "Verification Code has been sent to your email. Please check your inbox!",
      success: true,
      VarCode
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: err.message || err,
    });
  }
};

export const ManualRegister = async (req, res) => {
  try {
    const { username, email, Varcode, age, password, name } = req.body;
    // Check for missing fields
    if (!username || !email || !password || !Varcode || !age || !name) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    //  console.log(VarificationCode);
    // Fetch verification code for the email
    const VarCodeEntry = await VerificationCode.findOne({ email });

    // Check if verification code exists
    if (!VarCodeEntry) {
      return res.status(404).json({
        message: "Verification code not found or expired!",
        success: false,
      });
    }

    // Verify the provided code
    if (VarCodeEntry.VerfiCode != Varcode) {
      return res.status(400).json({
        message: "Invalid verification code!",
        success: false,
      });
    }

    // Check if user already exists
    const UserExist = await User.findOne({ email });
    if (UserExist) {
      if (UserExist.IsVerified) {
        return res.status(400).json({
          message: "User already registered and verified!",
          success: false,
        });
      }
      return res.status(400).json({
        message: "User already exists but is not verified!",
        success: false,
      });
    }

    // Register the user
    const newUser = new User({
      username,
      name,
      email,
      password,
      age,
      IsVerified: true,
    });

    const savedUser = await newUser.save();

    // Send a welcome email
    await WelComeMessage(email, username);

    // Remove the verification code entry after successful registration
    await VerificationCode.deleteOne({ email });

    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      user: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error!",
      success: false,
      error: err.message || err,
    });
  }
};

export const IsEmailFound = async (req, res) => {
  const email = req.body.email;
  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }
    const user = await User.findOne({ email }).select("IsVerified");
    if (user) {
      return res.status(200).json({ message: "User found!", success: true, user });
    }
    return res.status(404).json({ message: "User not found!", success: false });
  } catch (error) {
    console.error("IsEmailFound error:", error);
    return res.status(500).json({ error: "Internal server error!", success: false });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!", success: false });
    }
    const user = await User.findOne({ email });
    //!(await bcrypt.compare(password, user.password)
    if (!user) {
      return res.status(400).json({ error: "Invalid user credential!", success: false });
    }
    // Check if user is password is correct or not
    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid user credential!", success: false });
    }
    if (user) {
      jwtTokenFunction(user._id, user.username, user.email, user.profilePicture, res);
    }
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    const logedinUser = {
      _id: user._id,
      username: user.username,
      name: user.name,
      age: user.age,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    }
    return res.status(200).json({
      message: "User logged in successfully!",
      success: true,
      user: logedinUser
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const signout = async (req, res) => {
  try {
    res.cookie('quickchatjwttoken', '',
      {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: 'None',
        path: '/',
      });
    return res.status(201).json({ message: "User Loged Out successfully!", success: true });
  }
  catch (error) {
    console.log("error", error);
    return res.status(500).json({ error: "Internal server error!", success: false });
  }
};

export const GetProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({ path: "posts", options: { sort: { createdAt: -1 } }, populate: [
        { path: "author", select: "username profilePicture"},
        { path: "comments",
          populate: { path: "author", select: "username profilePicture" } 
        }
      ]})
      .populate({ path: "bookmarks", options: { sort: { createdAt: -1 } } })
      .select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found!", success: false });
    }

    return res.status(200).json({ user, success: true });

  } catch (error) {
    console.error("Error in GetProfile:", error.message);
    return res.status(500).json({ error: "Internal server error!", success: false });
  }
};
export const EditProfile = async (req, res) => {
  try {
    const { username, age, bio, gender } = req.body;
    let profilePic;
    if (req.file) {
      profilePic = req.file.path;
      console.log(profilePic);
    }
    if (!username && !age && !bio && !gender && !profilePic) {
      return res.status(400).json({
        message: "No fields to update provided",
        success: false,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.id,
      {
        ...(username && { username }),
        ...(age && { age }),
        ...(bio && { bio }),
        ...(gender && { gender }),
        ...(profilePic && { profilePicture: profilePic }),
      },
      { new: true, runValidators: true } // Return updated user and run validations
    ).select("-password"); // Exclude sensitive fields like password
    if (!updatedUser) {
      return res.status(404).json(
        {
          message: "User not found!",
          success: false,
          userid: req.id
        });
    }
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password"); // Adjust the query as needed
    if (!suggestedUsers || suggestedUsers.length === 0) {
      return res.status(400).json({
        message: 'Currently do not have any suggested users!',
        success: false
      });
    }
    return res.status(200).json({
      message: "All Suggested Users Fetched!",
      success: true,
      users: suggestedUsers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};
// follow Or unfollow logic
export const FollowAndUnfollow = async (req, res) => {
  try {
    const IdOfUserWhichFollowsTargetUser = req.id;
    console.log("user 1", IdOfUserWhichFollowsTargetUser);
    const IdOfTheTargetUser = req.params.id;
    console.log("IdOfTheTargetUser ", IdOfTheTargetUser);
    if (!IdOfUserWhichFollowsTargetUser || !IdOfTheTargetUser) {
      return res.status(400).json({
        message: 'user id not found!',
        success: false
      });
    }
    if (IdOfUserWhichFollowsTargetUser === IdOfTheTargetUser) {
      return res.status(400).json({
        message: 'You Can not Follow or Unfollow Yourself!',
        success: false
      });
    }
    const [UserWhichFollowsTargetUser, TargetUser] = await Promise.all([
      User.findById(IdOfUserWhichFollowsTargetUser),
      User.findById(IdOfTheTargetUser),
    ]);
    //  Find both users
    if (!UserWhichFollowsTargetUser || !TargetUser) {
      return res.status(404).json({
        message: 'User not found!',
        success: false,
      });
    }
    //follow karna hai ya unfollow
    const Isfollowed = UserWhichFollowsTargetUser.following.includes(IdOfTheTargetUser);
    if (Isfollowed) {
      //unfollow logic
      await Promise.all([
        User.updateOne({ _id: IdOfUserWhichFollowsTargetUser }, { $pull: { following: IdOfTheTargetUser } }),
        User.updateOne({ _id: IdOfTheTargetUser }, { $pull: { followers: IdOfUserWhichFollowsTargetUser } }),
      ])
      return res.status(200).json({
        message: 'Unfollowed Successfully!',
        success: true
      });
    }
    else {
      //unfollow logic
      await Promise.all([
        User.updateOne({ _id: IdOfUserWhichFollowsTargetUser }, { $push: { following: IdOfTheTargetUser } }),
        User.updateOne({ _id: IdOfTheTargetUser }, { $push: { followers: IdOfUserWhichFollowsTargetUser } })
      ]);
      return res.status(200).json({
        message: 'followed Successfully!',
        success: true
      });
    }
  } catch (error) {
    console.error('Error in FollowAndUnfollowLogin:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
}