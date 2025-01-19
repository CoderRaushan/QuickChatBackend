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
    // for reducing the quality of photo
    const quality = file.mimetype === "image/jpeg" || file.mimetype === "image/png" ? "auto:80" : null;
    return {
      folder: "QuickChat",
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4", "mp3"],
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`, // Custom filename without extension duplication
      transformation: [
        // for resizing
        { width: 800, height: 800, crop: 'limit' }, 
        { quality: quality }, // Reduces quality for image formats
        { fetch_format: 'auto' }, // Automatically convert to optimal format (e.g., WebP, JPEG)
      ],
    };
  },
});
export const upload = multer({ storage: storage }); //export upload to router 
