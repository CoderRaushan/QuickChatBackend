import { WelComeMessage } from "../middlewares/WelComeEmail.js";
import User from "../models/UserModel.js";
import express from "express";
const app=express();
app.use(express.json());
export const ManualRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const UserExist = await User.findOne({ email });
    if (UserExist) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }
    const user = new User({
      username,
      email,
      password,
      verificationCode,
    });
    const savedUser = await user.save();
    VarifyEmail(email, verificationCode);
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: savedUser,
    });
    console.log(savedUser);
  } catch (err) {
    res.status(500).json({
      message: "Internal server error!",
      success: false,
      err,
    });
  }
};

export const VarifyEmail = async (req, res) => {
  const {verificationCode} = req.body;
  try {
    const user = await User.findOne({verificationCode});
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    user.IsVerified = true;
    user.verificationCode = undefined;
    await user.save();
    WelComeMessage(user.email,user.username);
    res
      .status(200)
      .json({ message: "Email verified successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed please Enter correct email!", error });
  }
};
