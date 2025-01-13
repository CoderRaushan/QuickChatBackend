import express, { urlencoded } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRouter from "./routes/UserRoute.js"
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions={
    origin:["http://localhost:5173"],
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
app.use('/account',UserRouter);
const port = process.env.PORT || 4234;
app.listen(port, () => {
  console.log(`app is listening on port http://localhost:${port}`);
});
