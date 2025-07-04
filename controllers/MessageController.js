import { io } from '../socket/socket.js';
import Conversation from '../models/ConversationModel.js';
import Message from '../models/MessageModel.js';
import { getReceiverSocketId } from '../socket/socket.js';
import { getPresignedUrl } from "../utils/getPresignedUrl.js"
//send message 
// export const SendMessage = async (req, res) => {
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
// };
// export const SendMessage = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ success: false, message: "Message content is required" });
//     }

//     // Find or create conversation
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       conversationId: conversation._id,
//       messages: text
//     });

//     // Emit message via socket.io
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
// };

// export const SendFile = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const { text, fileData, fileType, fileName,fileSize } = req.body;

//     if (!text && !fileData) {
//       return res.status(400).json({
//         success: false,
//         message: "Either text or file is required!"
//       });
//     }

//     // Find existing conversation or create new one
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     }).populate("message");

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//      const newfileData = {
//         url: fileData,
//         filename: fileName,
//         size: fileSize,
//         mimetype: fileType,
//       };
//     // Create new message
//     const newMessage = await Message.create({
//       senderId,
//       receiverId,
//       messages: text,
//       file: newfileData
//     });

//     if (newMessage) {
//       conversation.message.push(newMessage._id);
//       await Promise.all([conversation.save(), newMessage.save()]);
//     }

//     // Emit message via socket.io (if receiver is connected)
//     const ReceiverSocketId = getReceiverSocketId(receiverId);
//     if (ReceiverSocketId) {
//       io.to(ReceiverSocketId).emit("newMessage", newMessage);
//     }

//     return res.status(201).json({
//       success: true,
//       newMessage
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error!"
//     });
//   }
// };
// export const SendFile = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;
//     const { text, fileUrl, fileType, fileName, fileSize } = req.body;

//     if (!text && !fileData) {
//       return res.status(400).json({
//         success: false,
//         message: "Either text or file is required!"
//       });
//     }
//     // Find or create conversation
//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     const fileObj = {
//       url: fileUrl,
//       filename: fileName,
//       size: fileSize,
//       mimetype: fileType,
//     };

//     const newMessage = await Message.create({
//       conversationId:conversation._id,
//       senderId,
//       receiverId,
//       messages: text,
//       file: fileObj,
//     });

//     // Emit message via socket.io
//     const ReceiverSocketId = getReceiverSocketId(receiverId);
//     if (ReceiverSocketId) {
//       io.to(ReceiverSocketId).emit("newMessage", newMessage);
//     }

//     return res.status(201).json({
//       success: true,
//       newMessage
//     });

//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error!"
//     });
//   }
// };


//get message b/w sender and receiver
// export const GetMessage = async (req, res) => {
//   try {
//     const senderId = req.id;
//     const receiverId = req.params.id;

//     const conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     }).populate('message');

//     if (!conversation) {
//       return res.status(404).json({
//         message: 'No conversation found',
//         success: false
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       messages: conversation.message
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: 'Internal server error!',
//       success: false
//     });
//   }
// };
// export const GetMessage = async (req, res) => {
//   try {
//     // const senderId = req.id;
//     const conversationId = req.params.id;
//     // const conversation = await Conversation.findOne({
//     //   participants: { $all: [senderId, receiverId] }
//     // });

//     if (!conversationId) {
//       return res.status(404).json({
//         success: false,
//         message: 'No conversation found'
//       });
//     }

//     const messages = await Message.find({ conversationId })
//       .sort({ createdAt: 1 });
//     return res.status(200).json({
//       success: true,
//       messages
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       success: false,
//       message: 'Internal server error!'
//     });
//   }
// };

export const GetMessage = async (req, res) => {
  try {
    console.log("reached here ")
    const { conversationId } = req.params;
    console.log("convers",conversationId);
    const { limit = 5, skip = 0 } = req.query;
    console.log("limit,skip",limit,skip)

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 }) // newest first
      .skip(Number(skip))
      .limit(Number(limit));
    console.log("messages");
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const startConversation = async (req, res) => {
  try {
    const senderId = req.id;
    const mutualUserIds = req.body.userIds; // Array of user IDs

    const conversationMap = {};

    for (const receiverId of mutualUserIds) {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId], $size: 2 },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
      conversationMap[receiverId] = conversation._id;
    }

    return res.status(200).json({
      success: true,
      conversationMap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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