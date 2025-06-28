import { io } from '../socket/socket.js';
import Conversation from '../models/ConversationModel.js';
import Message from '../models/MessageModel.js';
import { getReceiverSocketId } from '../socket/socket.js';
import { getPresignedUrl } from "../utils/getPresignedUrl.js"
//send message 
export const SendMessage = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const { text } = req.body;
//     if (!text) {
//       return res.status(400).json({ success: false, message: "Message content is required" });
//     }
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     }).populate("message");

//     // Establish the conversation if not started yet
//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }
//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       messages: text
//     });

//     if (newMessage) {
//       conversation.message.push(newMessage._id);
//       await Promise.all([conversation.save(), newMessage.save()]);
//     }
//     // Implement socket.io for real-time data transfer (if needed)
//     const ReceiverSocketId = getReceiverSocketId(receiverId);
//     if (ReceiverSocketId) {
//       io.to(ReceiverSocketId).emit("newMessage", newMessage);
//     }
//     return res.status(201).json({
//       success: true,
//       newMessage
//     });  
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: 'Internal server error!',
//       success: false
//     });
//   }
};

export const SendFile = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { text, fileData, fileType, fileName,fileSize } = req.body;

    if (!text && !fileData) {
      return res.status(400).json({
        success: false,
        message: "Either text or file is required!"
      });
    }

    // Find existing conversation or create new one
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate("message");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

     const newfileData = {
        url: fileData,
        filename: fileName,
        size: fileSize,
        mimetype: fileType,
      };
    // Create new message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      messages: text,
      file: newfileData
    });

    if (newMessage) {
      conversation.message.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);
    }

    // Emit message via socket.io (if receiver is connected)
    const ReceiverSocketId = getReceiverSocketId(receiverId);
    if (ReceiverSocketId) {
      io.to(ReceiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error!"
    });
  }
};

//get message b/w sender and receiver
export const GetMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('message');

    if (!conversation) {
      return res.status(404).json({
        message: 'No conversation found',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.message
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};
export const GetUploadURL = async (req, res) => {
  try {
    const { fileType, originalName } = req.body;
    const { uploadUrl, fileUrl } = await getPresignedUrl(fileType, originalName);
    return res.status(200).json({
      success: true,
      messages: "File Upload Signed Url success!",
      uploadUrl,
      fileUrl
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error generating pre-signed URL",
    });
  }

}