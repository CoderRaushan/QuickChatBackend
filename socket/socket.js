import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/MessageModel.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"],
});

// User socket mapping and call state tracking
const UserSocketMap = {};
const CallStates = new Map(); // Track active calls

export const getReceiverSocketId = (receiverId) => UserSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    UserSocketMap[userId] = socket.id;
    console.log("User connected:", userId, socket.id);
  }

  // Broadcast current online user IDs
  io.emit("OnlineUsers", Object.keys(UserSocketMap));

  // Debug logging for development
  socket.onAny((event, ...args) => {
    console.log(`[socket:${socket.id}] event ->`, event, args);
  });

  // MARK: Message seen
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

  // MARK: Send message
  socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
    try {
      const senderId = userId;
      if (!conversationId || !receiverId || !tempId) {
        return socket.emit("send-message-error", { message: "conversationId, receiverId and tempId are required", tempId });
      }

      const fileObj = fileUrl
        ? { url: fileUrl, filename: fileName, size: fileSize, mimetype: fileType }
        : null;

      const newMessage = await Message.create({
        conversationId,
        senderId,
        receiverId,
        messages: text,
        file: fileObj,
      });

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      io.to(socket.id).emit("message-confirmed", {
        ...newMessage.toObject(),
        tempId,
      });
    } catch (error) {
      console.error("Error sending message via socket:", error);
      socket.emit("send-message-error", { message: "Internal server error", tempId });
    }
  });

  // Typing indicators
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

  // MARK: Enhanced Video Calling Events

  // Call user - initiate call
  socket.on("call-user", ({ from, to, userInfo, callType = 'video' }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      // Check if user is already in a call
      if (CallStates.has(to)) {
        io.to(socket.id).emit("user-busy", { to, reason: "User is in another call" });
        return;
      }

      // Track call state
      CallStates.set(to, { 
        caller: from, 
        callee: to, 
        status: 'incoming',
        callType,
        timestamp: Date.now()
      });

      io.to(receiverSocketId).emit("incoming-call", { 
        from, 
        userInfo,
        callType 
      });
      
      console.log(`Call initiated: ${from} -> ${to} (${callType})`);
    } else {
      io.to(socket.id).emit("user-offline", { to });
    }
  });

  // Call accepted
  socket.on("call-accepted", ({ from, to }) => {
    const callerSocketId = UserSocketMap[to];
    
    if (callerSocketId) {
      const callState = CallStates.get(from);
      if (callState) {
        callState.status = 'connected';
        callState.acceptedAt = Date.now();
      }
      
      io.to(callerSocketId).emit("call-accepted", { from, to });
      console.log(`Call accepted: ${from} -> ${to}`);
    }
  });

  // Call rejected
  socket.on("call-rejected", ({ from, to, reason }) => {
    const callerSocketId = UserSocketMap[to];
    
    if (callerSocketId) {
      CallStates.delete(from);
      io.to(callerSocketId).emit("call-rejected", { from, to, reason });
      console.log(`Call rejected: ${from} -> ${to} (${reason || 'No reason'})`);
    }
  });

  // Call ended/hangup
  socket.on("hangup", ({ from, to, reason }) => {
    const targetSocketId = UserSocketMap[to];
    
    if (targetSocketId) {
      io.to(targetSocketId).emit("hangup", { from, reason });
      console.log(`Call ended: ${from} -> ${to} (${reason || 'No reason'})`);
    }
    
    // Clean up call state
    CallStates.delete(from);
    CallStates.delete(to);
  });

  // WebRTC signaling: offer
  socket.on("offer", ({ from, to, offer }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("offer", { from, to, offer });
      console.log(`Offer sent: ${from} -> ${to}`);
    } else {
      io.to(socket.id).emit("user-offline", { to });
    }
  });

  // WebRTC signaling: answer
  socket.on("answer", ({ from, to, answer }) => {
    const callerSocketId = UserSocketMap[to];
    
    if (callerSocketId) {
      io.to(callerSocketId).emit("answer", { from, to, answer });
      console.log(`Answer sent: ${from} -> ${to}`);
    }
  });

  // ICE candidate exchange
  socket.on("icecandidate", ({ from, to, candidate }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("icecandidate", { from, candidate });
    }
  });

  // Call quality feedback
  socket.on("call-quality", ({ from, to, quality }) => {
    const targetSocketId = UserSocketMap[to];
    
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-quality", { from, quality });
    }
  });

  // Screen sharing events
  socket.on("screen-share-start", ({ from, to }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("screen-share-start", { from });
    }
  });

  socket.on("screen-share-stop", ({ from, to }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("screen-share-stop", { from });
    }
  });

  // Call recording events
  socket.on("recording-start", ({ from, to }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("recording-start", { from });
    }
  });

  socket.on("recording-stop", ({ from, to }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("recording-stop", { from });
    }
  });

  // Call mute/unmute events
  socket.on("audio-toggle", ({ from, to, isMuted }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("audio-toggle", { from, isMuted });
    }
  });

  socket.on("video-toggle", ({ from, to, isVideoOff }) => {
    const receiverSocketId = UserSocketMap[to];
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("video-toggle", { from, isVideoOff });
    }
  });

  // Get call status
  socket.on("get-call-status", ({ userId }) => {
    const callState = CallStates.get(userId);
    socket.emit("call-status", { userId, callState });
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    
    if (userId) {
      // Clean up any active calls
      const userCalls = Array.from(CallStates.entries()).filter(([key, value]) => 
        value.caller === userId || value.callee === userId
      );
      
      userCalls.forEach(([key, callState]) => {
        const targetId = callState.caller === userId ? callState.callee : callState.caller;
        const targetSocketId = UserSocketMap[targetId];
        
        if (targetSocketId) {
          io.to(targetSocketId).emit("user-disconnected", { 
            userId, 
            reason: "User disconnected" 
          });
        }
        
        CallStates.delete(key);
      });
      
      delete UserSocketMap[userId];
    }
    
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });
});

export { io, app, server };