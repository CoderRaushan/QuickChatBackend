import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: {
    type: String,
  },
  file: {
    url: String,        // Cloudinary or local path
    filename: String,   // Original filename
    size: Number,       // In bytes
    mimetype: String    // Useful for detecting type (image/pdf/video etc.)
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "seen"],
    default: "sent",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
