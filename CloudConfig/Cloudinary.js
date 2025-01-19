import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
import User from '../models/UserModel.js';
dotenv.config();
//config cloudinary with credentials
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret_key,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "QuickChat",
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4", "mp3"],
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`, // Custom filename without extension duplication
    };
  },
});
export const upload = multer({ storage: storage }); //export upload to router 
