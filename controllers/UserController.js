import { WelComeMessage } from "../middlewares/WelComeEmail.js";
import User from "../models/UserModel.js";
import VerificationCode from "../models/VerificationCodeModel.js"
import { SendVarificationCode } from "../middlewares/VarifyEmail.js";

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
    const { username, email, VarificationCode, age, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password || !VarificationCode || !age) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

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
    if (VarCodeEntry.VerfiCode !== VarificationCode) {
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


export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const user = await User.findOne({ email });
//!(await bcrypt.compare(password, user.password)
    if (!user)
    {
      return res.status(400).json({ error: "Invalid user credential!" });
    }

    // if (user)
    // {
    //   jwtTokenFunction(user._id, user.name, user.email,user.photo, res);
    // }

    return res.status(200).json({
      message: "User logged in successfully!",
      _id: user._id,
      name: user.name,
      email: user.email,
      // photo: user.photo,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};
