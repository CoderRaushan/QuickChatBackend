import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema({
//   senderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   receiverId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   messages: {
//     type: String,
//   },
//   file: {
//     url: String,        
//     filename: String,   
//     size: Number,      
//     mimetype: String   
//   },
//   status: {
//     type: String,
//     enum: ["sent", "delivered", "seen"],
//     default: "sent",
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Message = mongoose.model('Message', messageSchema);
// export default Message;
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
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
  messages: String,
  file: {
    url: String,        
    filename: String,   
    size: Number,      
    mimetype: String   
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

