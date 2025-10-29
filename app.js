import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
import { app,server } from "./socket/socket.js";
import UserRouter from "./routes/UserRoute.js";
import PostRouter from "./routes/PostRoutes.js";
import MessageRouter from "./routes/MessageRoutes.js";
import StoryRouter from "./routes/StoryRoute.js";

// end pasport config
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin:["http://localhost:5173","https://rausinsta.netlify.app"],
    credentials:true,
}
app.use(cors(corsOptions));
const MONGODB_URI = process.env.MONGODB_URI;
try {
  mongoose.connect(MONGODB_URI).then(() => {
    console.log("mongodb connected successfully!");
  });
} catch (err) {
    console.log("Mongodb connections error!",err);
}
app.use('/auth',UserRouter);
app.use('/user',UserRouter);
app.use("/user/post",PostRouter);
app.use("/user/message",MessageRouter);
app.use("/user/story",StoryRouter);
const port = process.env.PORT || 4234;
server.listen(port, () => {
  console.log(`app is listening on port http://localhost:${port}`);
}); 