import Conversation from '../models/ConversationModel.js';
import Message from '../models/MessageModel.js';
//send message
export const SendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    // Establish the conversation if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(),newMessage.save()]);
    }

    // Implement socket.io for real-time data transfer (if needed)

    return res.status(201).json({
      success: true,
      newMessage
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
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
    }).populate('messages');

    if (!conversation) {
      return res.status(404).json({
        message: 'No conversation found',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error!',
      success: false
    });
  }
};