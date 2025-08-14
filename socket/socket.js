// import { Server } from "socket.io";
// import express from "express";
// import http from "http";
// import Message from "../models/MessageModel.js";
// // import Conversation from '../models/ConversationModel.js';
// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ["websocket"],
// });

// const UserSocketMap = {};

// export const getReceiverSocketId = (receiverId) => {
//   return UserSocketMap[receiverId];
// };

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;

//   if (userId) {
//     UserSocketMap[userId] = socket.id;
//     console.log("User connected:", userId, socket.id);
//   }

//   io.emit("OnlineUsers", Object.keys(UserSocketMap));

//   socket.on("message-seen", async (messageId) => {
//     try {
//       await Message.findByIdAndUpdate(messageId, { status: "seen" });
//       const msg = await Message.findById(messageId);
//       const senderSocket = UserSocketMap[msg.senderId?.toString()];
//       if (senderSocket) {
//         io.to(senderSocket).emit("message-status-updated", msg);
//       }
//     } catch (err) {
//       console.error("message-seen error:", err.message);
//     }
//   });
//   socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
//     try {
//       const senderId = userId;
//       // let conversation = await Conversation.findOne({
//       //   participants: { $all: [senderId, receiverId] },
//       // });

//       // If no conversation exists, create one
//       if (!conversationId || !receiverId || !tempId) {
//         return res.status(400).json({ success: false, message: "conversationId,receiverId,tempId is required" });
//       }
//       // const newMessage = await Message.create({
//       //   conversationId: conversation._id,
//       //   senderId,
//       //   receiverId,
//       //   messages: text,
//       // });

//       const fileObj = {
//         url: fileUrl,
//         filename: fileName,
//         size: fileSize,
//         mimetype: fileType,
//       };

//       const newMessage = await Message.create({
//         conversationId,
//         senderId,
//         receiverId,
//         messages: text,
//         file: fileObj,
//       });

//       const ReceiverSocketId = getReceiverSocketId(receiverId);
//       if (ReceiverSocketId) {
//         io.to(ReceiverSocketId).emit("newMessage", newMessage);
//       }
//       io.to(socket.id).emit("message-confirmed", {
//         ...newMessage.toObject(),
//         tempId,
//       });
//     } catch (error) {
//       console.error("Error sending message via socket:", error);
//     }
//   });
//   socket.on("typing", ({ to, from, username }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("typing", { from, username });
//     }
//   });

//   socket.on("stop-typing", ({ to }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("stop-typing", { from: userId });
//     }
//   });

//   socket.on("offer", ({ from, to, offer }) => {
//     console.log({ from, to, offer });
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("offer", { from, to, offer });
//     }
//   });

//   socket.on("answer", ({ from, to, answer }) => {
//     const receiverSocketId = UserSocketMap[from];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("answer", {
//         from,
//         to,
//         answer
//       })
//     }
//   });
//   socket.on("icecandidate", ({ candidate, to }) => {
//     io.to(to).emit("icecandidate", candidate);
//   });

//   socket.on("call-user", ({ from, to, userInfo }) => {
//   const receiverSocketId = UserSocketMap[to];
//   if (receiverSocketId) {
//     io.to(receiverSocketId).emit("incoming-call", {
//       from,
//       userInfo, // Optional: name, image etc.
//     });
//   }
// });

// socket.on("call-accepted", ({ from, to }) => {
//   const callerSocketId = UserSocketMap[from];
//   if (callerSocketId) {
//     io.to(callerSocketId).emit("call-accepted", { to });
//   }
// });

// socket.on("call-rejected", ({ from, to }) => {
//   const callerSocketId = UserSocketMap[from];
//   if (callerSocketId) {
//     io.to(callerSocketId).emit("call-rejected", { to });
//   }
// });


//   socket.on("disconnect", () => {
//     console.log("User disconnected:", userId);
//     delete UserSocketMap[userId];
//     io.emit("OnlineUsers", Object.keys(UserSocketMap));
//   });
// });

// export { io, app, server }; //baisc one 

// import { Server } from "socket.io";
// import express from "express";
// import http from "http";
// import Message from "../models/MessageModel.js";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ["websocket"],
// });

// const UserSocketMap = {};

// export const getReceiverSocketId = (receiverId) => {
//   return UserSocketMap[receiverId];
// };

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;

//   if (userId) {
//     UserSocketMap[userId] = socket.id;
//     console.log("User connected:", userId, socket.id);
//   }

//   io.emit("OnlineUsers", Object.keys(UserSocketMap));

//   socket.on("message-seen", async (messageId) => {
//     try {
//       await Message.findByIdAndUpdate(messageId, { status: "seen" });
//       const msg = await Message.findById(messageId);
//       const senderSocket = UserSocketMap[msg.senderId?.toString()];
//       if (senderSocket) {
//         io.to(senderSocket).emit("message-status-updated", msg);
//       }
//     } catch (err) {
//       console.error("message-seen error:", err.message);
//     }
//   });

//   socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
//     try {
//       const senderId = userId;
//       if (!conversationId || !receiverId || !tempId) {
//         return;
//       }
//       const fileObj = {
//         url: fileUrl,
//         filename: fileName,
//         size: fileSize,
//         mimetype: fileType,
//       };
//       const newMessage = await Message.create({
//         conversationId,
//         senderId,
//         receiverId,
//         messages: text,
//         file: fileObj,
//       });

//       const ReceiverSocketId = getReceiverSocketId(receiverId);
//       if (ReceiverSocketId) {
//         io.to(ReceiverSocketId).emit("newMessage", newMessage);
//       }
//       io.to(socket.id).emit("message-confirmed", {
//         ...newMessage.toObject(),
//         tempId,
//       });
//     } catch (error) {
//       console.error("Error sending message via socket:", error);
//     }
//   });

//   socket.on("typing", ({ to, from, username }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("typing", { from, username });
//     }
//   });

//   socket.on("stop-typing", ({ to }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("stop-typing", { from: userId });
//     }
//   });

//   socket.on("offer", ({ from, to, offer }) => {
//     console.log({ from, to, offer });
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("offer", { from, offer });
//     }
//   });

//   socket.on("answer", ({ from, to, answer }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("answer", {
//         from,
//         answer
//       });
//     }
//   });

//   socket.on("icecandidate", ({ candidate, to }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("icecandidate", candidate);
//     }
//   });

//   socket.on("call-user", ({ from, to, userInfo }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("incoming-call", {
//         from,
//         userInfo,
//       });
//     }
//   });

//   socket.on("call-accepted", ({ from, to }) => {
//     // Corrected logic: 'to' is the caller's ID
//     const callerSocketId = UserSocketMap[to]; 
//     if (callerSocketId) {
//       io.to(callerSocketId).emit("call-accepted", { from });
//     }
//   });

//   socket.on("call-rejected", ({ from, to }) => {
//     const callerSocketId = UserSocketMap[to];
//     if (callerSocketId) {
//       io.to(callerSocketId).emit("call-rejected", { from });
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", userId);
//     delete UserSocketMap[userId];
//     io.emit("OnlineUsers", Object.keys(UserSocketMap));
//   });
// });

// export { io, app, server };

// import { Server } from "socket.io";
// import express from "express";
// import http from "http";
// import Message from "../models/MessageModel.js";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   transports: ["websocket", "polling"], // Allow both for better reliability
//   pingTimeout: 60000,
//   pingInterval: 25000,
// });

// const UserSocketMap = {};
// const activeCalls = new Map(); // Track active calls

// export const getReceiverSocketId = (receiverId) => {
//   return UserSocketMap[receiverId];
// };

// // Helper function to clean up call data
// const cleanupCall = (callId) => {
//   if (activeCalls.has(callId)) {
//     const callData = activeCalls.get(callId);
//     console.log(`Cleaning up call: ${callId}`);
    
//     // Notify participants that call ended
//     if (callData.caller && UserSocketMap[callData.caller]) {
//       io.to(UserSocketMap[callData.caller]).emit("call-ended", { callId });
//     }
//     if (callData.callee && UserSocketMap[callData.callee]) {
//       io.to(UserSocketMap[callData.callee]).emit("call-ended", { callId });
//     }
    
//     activeCalls.delete(callId);
//   }
// };

// io.on("connection", (socket) => {
//   const userId = socket.handshake.query.userId;

//   if (userId) {
//     UserSocketMap[userId] = socket.id;
//     console.log(`User connected: ${userId} with socket: ${socket.id}`);
    
//     // Clean up any existing calls for this user
//     for (const [callId, callData] of activeCalls.entries()) {
//       if (callData.caller === userId || callData.callee === userId) {
//         cleanupCall(callId);
//       }
//     }
//   }

//   // Broadcast online users
//   io.emit("OnlineUsers", Object.keys(UserSocketMap));

//   // Message seen handler
//   socket.on("message-seen", async (messageId) => {
//     try {
//       await Message.findByIdAndUpdate(messageId, { status: "seen" });
//       const msg = await Message.findById(messageId);
//       const senderSocket = UserSocketMap[msg.senderId?.toString()];
//       if (senderSocket) {
//         io.to(senderSocket).emit("message-status-updated", msg);
//       }
//     } catch (err) {
//       console.error("message-seen error:", err.message);
//     }
//   });

//   // Send message handler
//   socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
//     try {
//       const senderId = userId;
//       if (!conversationId || !receiverId || !tempId) {
//         return;
//       }
      
//       const fileObj = {
//         url: fileUrl,
//         filename: fileName,
//         size: fileSize,
//         mimetype: fileType,
//       };
      
//       const newMessage = await Message.create({
//         conversationId,
//         senderId,
//         receiverId,
//         messages: text,
//         file: fileObj,
//       });

//       const ReceiverSocketId = getReceiverSocketId(receiverId);
//       if (ReceiverSocketId) {
//         io.to(ReceiverSocketId).emit("newMessage", newMessage);
//       }
      
//       io.to(socket.id).emit("message-confirmed", {
//         ...newMessage.toObject(),
//         tempId,
//       });
//     } catch (error) {
//       console.error("Error sending message via socket:", error);
//       socket.emit("message-error", { error: "Failed to send message", tempId });
//     }
//   });

//   // Typing indicators
//   socket.on("typing", ({ to, from, username }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("typing", { from, username });
//     }
//   });

//   socket.on("stop-typing", ({ to }) => {
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("stop-typing", { from: userId });
//     }
//   });

//   // WebRTC Call Signaling
  
//   // Initiate call
//   socket.on("call-user", ({ from, to, userInfo }) => {
//     console.log(`Call initiated: ${from} -> ${to}`);
    
//     const receiverSocketId = UserSocketMap[to];
//     if (!receiverSocketId) {
//       socket.emit("call-failed", { reason: "User not online" });
//       return;
//     }

//     // Check if either user is already in a call
//     for (const [callId, callData] of activeCalls.entries()) {
//       if (callData.caller === from || callData.callee === from || 
//           callData.caller === to || callData.callee === to) {
//         socket.emit("call-failed", { reason: "User busy" });
//         return;
//       }
//     }

//     const callId = `${from}-${to}-${Date.now()}`;
//     activeCalls.set(callId, {
//       caller: from,
//       callee: to,
//       status: "ringing",
//       createdAt: new Date()
//     });

//     io.to(receiverSocketId).emit("incoming-call", {
//       callId,
//       from,
//       userInfo,
//     });

//     // Set call timeout (30 seconds)
//     setTimeout(() => {
//       if (activeCalls.has(callId) && activeCalls.get(callId).status === "ringing") {
//         cleanupCall(callId);
//         socket.emit("call-timeout", { callId });
//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("call-timeout", { callId });
//         }
//       }
//     }, 30000);
//   });

//   // Accept call
//   socket.on("call-accepted", ({ from, to, callId }) => {
//     console.log(`Call accepted: ${callId || 'legacy'} by ${from}`);
    
//     const callerSocketId = UserSocketMap[to];
//     if (callerSocketId) {
//       // Update call status
//       for (const [id, callData] of activeCalls.entries()) {
//         if ((callData.caller === to && callData.callee === from) || 
//             (callId && id === callId)) {
//           callData.status = "accepted";
//           break;
//         }
//       }
      
//       io.to(callerSocketId).emit("call-accepted", { from, callId });
//     }
//   });

//   // Reject call
//   socket.on("call-rejected", ({ from, to, callId }) => {
//     console.log(`Call rejected: ${callId || 'legacy'} by ${from}`);
    
//     const callerSocketId = UserSocketMap[to];
//     if (callerSocketId) {
//       io.to(callerSocketId).emit("call-rejected", { from, callId });
//     }
    
//     // Clean up call data
//     if (callId) {
//       cleanupCall(callId);
//     } else {
//       // Legacy cleanup
//       for (const [id, callData] of activeCalls.entries()) {
//         if (callData.caller === to && callData.callee === from) {
//           cleanupCall(id);
//           break;
//         }
//       }
//     }
//   });

//   // WebRTC signaling
//   socket.on("offer", ({ from, to, offer }) => {
//     console.log(`WebRTC offer: ${from} -> ${to}`);
    
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       // Update call status to active
//       for (const [callId, callData] of activeCalls.entries()) {
//         if ((callData.caller === from && callData.callee === to) || 
//             (callData.caller === to && callData.callee === from)) {
//           callData.status = "active";
//           break;
//         }
//       }
      
//       io.to(receiverSocketId).emit("offer", { from, offer });
//     } else {
//       socket.emit("call-failed", { reason: "User disconnected" });
//     }
//   });

//   socket.on("answer", ({ from, to, answer }) => {
//     console.log(`WebRTC answer: ${from} -> ${to}`);
    
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("answer", { from, answer });
//     } else {
//       socket.emit("call-failed", { reason: "User disconnected" });
//     }
//   });

//   socket.on("icecandidate", ({ candidate, to }) => {
//     console.log(`ICE candidate: -> ${to}`);
    
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("icecandidate", candidate);
//     }
//   });

//   // Call ended
//   socket.on("call-ended", ({ to, callId }) => {
//     console.log(`Call ended: ${callId || 'legacy'}`);
    
//     const receiverSocketId = UserSocketMap[to];
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("call-ended", { callId });
//     }
    
//     // Clean up call data
//     if (callId) {
//       cleanupCall(callId);
//     } else {
//       // Legacy cleanup - find and clean up any active calls involving these users
//       for (const [id, callData] of activeCalls.entries()) {
//         if (callData.caller === userId || callData.callee === userId ||
//             callData.caller === to || callData.callee === to) {
//           cleanupCall(id);
//         }
//       }
//     }
//   });

//   // Handle disconnection
//   socket.on("disconnect", (reason) => {
//     console.log(`User disconnected: ${userId}, reason: ${reason}`);
    
//     // Clean up user from socket map
//     delete UserSocketMap[userId];
    
//     // Clean up any active calls for this user
//     for (const [callId, callData] of activeCalls.entries()) {
//       if (callData.caller === userId || callData.callee === userId) {
//         cleanupCall(callId);
//       }
//     }
    
//     // Broadcast updated online users
//     io.emit("OnlineUsers", Object.keys(UserSocketMap));
//   });

//   // Handle connection errors
//   socket.on("connect_error", (error) => {
//     console.error("Socket connection error:", error);
//   });

//   // Heartbeat for connection monitoring
//   socket.on("ping", () => {
//     socket.emit("pong");
//   });
// });

// // Periodic cleanup of stale calls (every 5 minutes)
// setInterval(() => {
//   const now = new Date();
//   for (const [callId, callData] of activeCalls.entries()) {
//     const timeDiff = now - callData.createdAt;
//     // Clean up calls older than 10 minutes
//     if (timeDiff > 10 * 60 * 1000) {
//       console.log(`Cleaning up stale call: ${callId}`);
//       cleanupCall(callId);
//     }
//   }
// }, 5 * 60 * 1000);

// // Error handling for the server
// server.on("error", (error) => {
//   console.error("Server error:", error);
// });

// io.on("error", (error) => {
//   console.error("Socket.IO error:", error);
// });

// export { io, app, server };
import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/MessageModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

const UserSocketMap = {};
const activeCalls = new Map();
const callTimeouts = new Map();

export const getReceiverSocketId = (receiverId) => {
  return UserSocketMap[receiverId];
};

// Helper function to generate unique call ID
const generateCallId = (callerId, calleeId) => {
  return `call_${callerId}_${calleeId}_${Date.now()}`;
};

// Helper function to clean up call data
const cleanupCall = (callId, reason = "ended") => {
  if (activeCalls.has(callId)) {
    const callData = activeCalls.get(callId);
    console.log(`Cleaning up call: ${callId}, reason: ${reason}`);
    
    // Clear any timeouts
    if (callTimeouts.has(callId)) {
      clearTimeout(callTimeouts.get(callId));
      callTimeouts.delete(callId);
    }
    
    // Notify participants that call ended
    if (callData.caller && UserSocketMap[callData.caller]) {
      io.to(UserSocketMap[callData.caller]).emit("call-ended", { 
        callId, 
        reason,
        endedBy: callData.endedBy || "system"
      });
    }
    if (callData.callee && UserSocketMap[callData.callee]) {
      io.to(UserSocketMap[callData.callee]).emit("call-ended", { 
        callId, 
        reason,
        endedBy: callData.endedBy || "system"
      });
    }
    
    activeCalls.delete(callId);
  }
};

// Check if user is in any active call
const isUserInCall = (userId) => {
  for (const [callId, callData] of activeCalls.entries()) {
    if ((callData.caller === userId || callData.callee === userId) && 
        callData.status !== "ended") {
      return { inCall: true, callId, callData };
    }
  }
  return { inCall: false };
};

// Clean up all calls for a user
const cleanupUserCalls = (userId) => {
  const callsToCleanup = [];
  for (const [callId, callData] of activeCalls.entries()) {
    if (callData.caller === userId || callData.callee === userId) {
      callsToCleanup.push(callId);
    }
  }
  
  callsToCleanup.forEach(callId => {
    const callData = activeCalls.get(callId);
    if (callData) {
      callData.endedBy = userId;
      cleanupCall(callId, "user_disconnected");
    }
  });
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Clean up any existing calls for this user
    cleanupUserCalls(userId);
    
    UserSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} with socket: ${socket.id}`);
  }

  // Broadcast online users
  io.emit("OnlineUsers", Object.keys(UserSocketMap));

  // Message seen handler
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

  // Send message handler
  socket.on("send-message", async ({ conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize }) => {
    try {
      const senderId = userId;
      if (!conversationId || !receiverId || !tempId) {
        return;
      }
      
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
      socket.emit("message-error", { error: "Failed to send message", tempId });
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

  // ===================
  // VIDEO CALLING LOGIC
  // ===================
  
  // Initiate call
  socket.on("call-user", ({ from, to, userInfo }) => {
    console.log(`Call initiated: ${from} -> ${to}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (!receiverSocketId) {
      socket.emit("call-failed", { 
        reason: "User not online",
        to: to
      });
      return;
    }

    // Check if caller is already in a call
    const callerStatus = isUserInCall(from);
    if (callerStatus.inCall) {
      socket.emit("call-failed", { 
        reason: "You are already in a call",
        to: to
      });
      return;
    }

    // Check if callee is already in a call
    const calleeStatus = isUserInCall(to);
    if (calleeStatus.inCall) {
      socket.emit("call-failed", { 
        reason: "User is busy in another call",
        to: to
      });
      return;
    }

    const callId = generateCallId(from, to);
    const callData = {
      callId,
      caller: from,
      callee: to,
      status: "ringing",
      createdAt: new Date(),
      callerInfo: userInfo
    };
    
    activeCalls.set(callId, callData);

    // Send incoming call notification to callee
    io.to(receiverSocketId).emit("incoming-call", {
      callId,
      from,
      userInfo,
    });

    // Confirm call initiated to caller
    socket.emit("call-initiated", {
      callId,
      to,
      status: "ringing"
    });

    // Set call timeout (30 seconds)
    const timeoutId = setTimeout(() => {
      if (activeCalls.has(callId) && activeCalls.get(callId).status === "ringing") {
        console.log(`Call timeout: ${callId}`);
        const callData = activeCalls.get(callId);
        callData.endedBy = "system";
        cleanupCall(callId, "timeout");
        
        // Notify both parties
        socket.emit("call-timeout", { callId, to });
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("call-timeout", { callId, from });
        }
      }
    }, 30000);
    
    callTimeouts.set(callId, timeoutId);
  });

  // Accept call
  socket.on("call-accepted", ({ from, to, callId }) => {
    console.log(`Call accepted: ${callId} by ${from}`);
    
    const callerSocketId = UserSocketMap[to];
    if (!callerSocketId) {
      socket.emit("call-failed", { 
        reason: "Caller disconnected",
        callId
      });
      return;
    }

    // Update call status
    if (activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      callData.status = "accepted";
      callData.acceptedAt = new Date();
      
      // Clear timeout since call was accepted
      if (callTimeouts.has(callId)) {
        clearTimeout(callTimeouts.get(callId));
        callTimeouts.delete(callId);
      }
      
      // Notify caller that call was accepted
      io.to(callerSocketId).emit("call-accepted", { 
        from, 
        callId,
        calleeInfo: {
          name: from, // You might want to pass actual callee info here
          id: from
        }
      });
    } else {
      socket.emit("call-failed", { 
        reason: "Call not found",
        callId
      });
    }
  });

  // Reject call
  socket.on("call-rejected", ({ from, to, callId }) => {
    console.log(`Call rejected: ${callId} by ${from}`);
    
    const callerSocketId = UserSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-rejected", { 
        from, 
        callId,
        reason: "Call declined"
      });
    }
    
    // Clean up call data
    if (activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      callData.endedBy = from;
      cleanupCall(callId, "rejected");
    }
  });

  // WebRTC Signaling Events
  
  // Handle offer
  socket.on("offer", ({ from, to, offer }) => {
    console.log(`WebRTC offer: ${from} -> ${to}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (!receiverSocketId) {
      socket.emit("call-failed", { 
        reason: "User disconnected during call setup",
        to
      });
      return;
    }

    // Update call status to active
    for (const [callId, callData] of activeCalls.entries()) {
      if ((callData.caller === from && callData.callee === to) || 
          (callData.caller === to && callData.callee === from)) {
        callData.status = "connecting";
        callData.offerSentAt = new Date();
        break;
      }
    }
    
    io.to(receiverSocketId).emit("offer", { from, to, offer });
  });

  // Handle answer
  socket.on("answer", ({ from, to, answer }) => {
    console.log(`WebRTC answer: ${from} -> ${to}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (!receiverSocketId) {
      socket.emit("call-failed", { 
        reason: "User disconnected during call setup",
        to
      });
      return;
    }

    // Update call status
    for (const [callId, callData] of activeCalls.entries()) {
      if ((callData.caller === from && callData.callee === to) || 
          (callData.caller === to && callData.callee === from)) {
        callData.status = "connecting";
        callData.answerSentAt = new Date();
        break;
      }
    }
    
    io.to(receiverSocketId).emit("answer", { from, to, answer });
  });

  // Handle ICE candidates
  socket.on("icecandidate", ({ candidate, to }) => {
    console.log(`ICE candidate: -> ${to}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("icecandidate", candidate);
    } else {
      console.warn(`Receiver ${to} not found for ICE candidate`);
    }
  });

  // Handle call connected (when WebRTC connection is established)
  socket.on("call-connected", ({ to, callId }) => {
    console.log(`Call connected: ${callId}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-connected", { 
        from: userId,
        callId 
      });
    }

    // Update call status
    if (activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      callData.status = "active";
      callData.connectedAt = new Date();
    }
  });

  // Handle call ended by user
  socket.on("call-ended", ({ to, callId, reason = "ended" }) => {
    console.log(`Call ended by user: ${callId}, reason: ${reason}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call-ended", { 
        from: userId,
        callId,
        reason,
        endedBy: userId
      });
    }
    
    // Clean up call data
    if (callId && activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      callData.endedBy = userId;
      cleanupCall(callId, reason);
    } else {
      // Legacy cleanup - find and clean up any active calls involving these users
      const callsToCleanup = [];
      for (const [id, callData] of activeCalls.entries()) {
        if (callData.caller === userId || callData.callee === userId ||
            callData.caller === to || callData.callee === to) {
          callsToCleanup.push(id);
        }
      }
      
      callsToCleanup.forEach(id => {
        const callData = activeCalls.get(id);
        if (callData) {
          callData.endedBy = userId;
          cleanupCall(id, reason);
        }
      });
    }
  });

  // Handle media control events (mute/unmute, video on/off)
  socket.on("media-control", ({ to, type, enabled }) => {
    console.log(`Media control: ${type} ${enabled ? 'enabled' : 'disabled'} for ${to}`);
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("media-control", {
        from: userId,
        type, // 'audio' or 'video'
        enabled
      });
    }
  });

  // Get call status
  socket.on("get-call-status", ({ callId }, callback) => {
    if (activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      if (callback) {
        callback({
          success: true,
          callData: {
            callId: callData.callId,
            status: callData.status,
            caller: callData.caller,
            callee: callData.callee,
            createdAt: callData.createdAt,
            duration: callData.connectedAt ? 
              Math.floor((new Date() - callData.connectedAt) / 1000) : 0
          }
        });
      }
    } else {
      if (callback) {
        callback({ success: false, error: "Call not found" });
      }
    }
  });

  // Get active calls for user
  socket.on("get-user-calls", (callback) => {
    const userCalls = [];
    for (const [callId, callData] of activeCalls.entries()) {
      if (callData.caller === userId || callData.callee === userId) {
        userCalls.push({
          callId: callData.callId,
          status: callData.status,
          iscaller: callData.caller === userId,
          otherParty: callData.caller === userId ? callData.callee : callData.caller,
          createdAt: callData.createdAt
        });
      }
    }
    
    if (callback) {
      callback({ success: true, calls: userCalls });
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${userId}, reason: ${reason}`);
    
    // Clean up user from socket map
    delete UserSocketMap[userId];
    
    // Clean up any active calls for this user
    cleanupUserCalls(userId);
    
    // Broadcast updated online users
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });

  // Handle connection errors
  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  // Heartbeat for connection monitoring
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Handle user going offline/online status
  socket.on("user-status-change", ({ status }) => {
    if (userId) {
      io.emit("user-status-updated", {
        userId,
        status, // 'online', 'away', 'busy', 'offline'
        timestamp: new Date()
      });
    }
  });
});

// Periodic cleanup of stale calls (every 5 minutes)
setInterval(() => {
  const now = new Date();
  const staleCallIds = [];
  
  for (const [callId, callData] of activeCalls.entries()) {
    const timeDiff = now - callData.createdAt;
    
    // Clean up calls older than 10 minutes
    if (timeDiff > 10 * 60 * 1000) {
      staleCallIds.push(callId);
    }
    // Clean up ringing calls older than 2 minutes
    else if (callData.status === "ringing" && timeDiff > 2 * 60 * 1000) {
      staleCallIds.push(callId);
    }
    // Clean up connecting calls older than 5 minutes
    else if (callData.status === "connecting" && timeDiff > 5 * 60 * 1000) {
      staleCallIds.push(callId);
    }
  }
  
  staleCallIds.forEach(callId => {
    console.log(`Cleaning up stale call: ${callId}`);
    const callData = activeCalls.get(callId);
    if (callData) {
      callData.endedBy = "system";
      cleanupCall(callId, "stale");
    }
  });
}, 5 * 60 * 1000);

// Periodic cleanup of stale timeouts
setInterval(() => {
  const now = new Date();
  for (const [callId, timeoutId] of callTimeouts.entries()) {
    if (!activeCalls.has(callId)) {
      clearTimeout(timeoutId);
      callTimeouts.delete(callId);
    }
  }
}, 1 * 60 * 1000);

// Error handling for the server
server.on("error", (error) => {
  console.error("Server error:", error);
});

io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  
  // Clean up all active calls
  for (const [callId, callData] of activeCalls.entries()) {
    callData.endedBy = "system";
    cleanupCall(callId, "server_shutdown");
  }
  
  // Clear all timeouts
  for (const [callId, timeoutId] of callTimeouts.entries()) {
    clearTimeout(timeoutId);
  }
  
  io.close(() => {
    console.log('Socket.IO server closed');
    process.exit(0);
  });
});

export { io, app, server };