// import dotenv from "dotenv";
// dotenv.config();
// import { v2 as cloudinary } from 'cloudinary';
// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.cloud_api_key,
//   api_secret: process.env.cloud_api_secret_key,
// });

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "QuickChat",
//       allowed_formats: ["jpg", "png", "jpeg", "gif", "avif", "mp4", "mp3", "pdf", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt"],
//       public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
//     };
//   },
// });
// export const upload = multer({ storage: storage });

import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret_key,
});

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const ext = file.mimetype.split("/")[1];

//     // Determine resource_type based on file extension
//     let resourceType = "auto";
//     if (["mp4", "avi", "mov", "mkv", "flv"].includes(ext)) {
//       resourceType = "video";
//     } else if (["mp3", "wav"].includes(ext)) {
//       resourceType = "video"; // Cloudinary uses "video" for audio files too
//     } else if (!["jpeg", "png", "jpg", "gif", "avif", "webp"].includes(ext)) {
//       resourceType = "raw"; // For pdf, docx, zip, etc.
//     }

//     return {
//       folder: "QuickChat",
//       allowed_formats: ["jpg", "png", "jpeg", "gif", "avif", "mp4", "mp3", "pdf", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt"],
//       public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
//       resource_type: resourceType,
//     };
//   },
// });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "QuickChat",
      allowed_formats: [
        "jpg", "png", "jpeg", "gif", "avif", "mp4", "mp3", "pdf",
      ],
      public_id: `${file.originalname.split('.')[0]}-${Date.now()}`,
      // resource_type: resourceType, 
    };
  },
});


// Export Multer middleware
export const upload = multer({ storage: storage });
