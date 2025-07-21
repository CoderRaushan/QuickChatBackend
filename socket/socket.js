import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/MessageModel.js";
import Conversation from '../models/ConversationModel.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"],
});

const UserSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return UserSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    UserSocketMap[userId] = socket.id;
    console.log("User connected:", userId, socket.id);
  }

  io.emit("OnlineUsers", Object.keys(UserSocketMap));

  socket.on("message-seen", async (messageId) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: "seen" });
      const msg = await Message.findById(messageId);
      const senderSocket = UserSocketMap[msg.senderId?.toString()];
      if (senderSocket) {
        io.to(senderSocket).emit("message-status-updated", msg);
      }
    } catch (err) {
      console.error("message-seen error:", err.message);
    }
  });
  socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
    try {
      const senderId = userId;
      // let conversation = await Conversation.findOne({
      //   participants: { $all: [senderId, receiverId] },
      // });

      // If no conversation exists, create one
      if (!conversationId || !receiverId || !tempId) {
        return res.status(400).json({ success: false, message: "conversationId,receiverId,tempId is required" });
      }
      // const newMessage = await Message.create({
      //   conversationId: conversation._id,
      //   senderId,
      //   receiverId,
      //   messages: text,
      // });

      const fileObj = {
        url: fileUrl,
        filename: fileName,
        size: fileSize,
        mimetype: fileType,
      };

      const newMessage = await Message.create({
        conversationId,
        senderId,
        receiverId,
        messages: text,
        file: fileObj,
      });

      const ReceiverSocketId = getReceiverSocketId(receiverId);
      if (ReceiverSocketId) {
        io.to(ReceiverSocketId).emit("newMessage", newMessage);
      }
      io.to(socket.id).emit("message-confirmed", {
        ...newMessage.toObject(),
        tempId,
      });
    } catch (error) {
      console.error("Error sending message via socket:", error);
    }
  });
  socket.on("typing", ({ to, from, username }) => {
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { from, username });
    }
  });

  socket.on("stop-typing", ({ to }) => {
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", { from: userId });
    }
  });
  socket.on("offer", ({ from, to, offer }) => {
    console.log({ from, to, offer });
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("offer", { from, to, offer });
    }
  });

  socket.on("answer", ({ from, to, answer }) => {
    const receiverSocketId = UserSocketMap[from];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("answer", {
        from,
        to,
        answer
      })
    }
  });
  socket.on("icecandidate", ({ candidate, to }) => {
    io.to(to).emit("icecandidate", candidate);
  });

  socket.on("call-user", ({ from, to, userInfo }) => {
  const receiverSocketId = UserSocketMap[to];
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("incoming-call", {
      from,
      userInfo, // Optional: name, image etc.
    });
  }
});

socket.on("call-accepted", ({ from, to }) => {
  const callerSocketId = UserSocketMap[from];
  if (callerSocketId) {
    io.to(callerSocketId).emit("call-accepted", { to });
  }
});

socket.on("call-rejected", ({ from, to }) => {
  const callerSocketId = UserSocketMap[from];
  if (callerSocketId) {
    io.to(callerSocketId).emit("call-rejected", { to });
  }
});


  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete UserSocketMap[userId];
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });
});

export { io, app, server };
