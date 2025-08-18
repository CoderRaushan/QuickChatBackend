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
const activeCalls = new Map(); // Track active calls

export const getReceiverSocketId = (receiverId) => {
  return UserSocketMap[receiverId];
};

// Helper function to clean up call data
const cleanupCall = (callId) => {
  if (activeCalls.has(callId)) {
    const callData = activeCalls.get(callId);
    console.log(`Cleaning up call: ${callId}`);
    
    // Notify participants that call ended
    if (callData.caller && UserSocketMap[callData.caller]) {
      io.to(UserSocketMap[callData.caller]).emit("call-ended", { callId });
    }
    if (callData.callee && UserSocketMap[callData.callee]) {
      io.to(UserSocketMap[callData.callee]).emit("call-ended", { callId });
    }
    
    activeCalls.delete(callId);
  }
};

// Helper function to find call by participants
const findCallByParticipants = (userId1, userId2) => {
  for (const [callId, callData] of activeCalls.entries()) {
    if ((callData.caller === userId1 && callData.callee === userId2) ||
        (callData.caller === userId2 && callData.callee === userId1)) {
      return { callId, callData };
    }
  }
  return null;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    UserSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} with socket: ${socket.id}`);
    
    // Clean up any existing calls for this user
    for (const [callId, callData] of activeCalls.entries()) {
      if (callData.caller === userId || callData.callee === userId) {
        cleanupCall(callId);
      }
    }
  }

  // Broadcast online users
  io.emit("OnlineUsers", Object.keys(UserSocketMap));

  // Message seen handler
  socket.on("message-seen", async (messageId) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status: "seen" });
      const msg = await Message.findById(messageId);
      if (msg && msg.senderId) {
        const senderSocket = UserSocketMap[msg.senderId.toString()];
        if (senderSocket) {
          io.to(senderSocket).emit("message-status-updated", msg);
        }
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
        socket.emit("message-error", { error: "Missing required fields", tempId });
        return;
      }
      
      const fileObj = fileUrl ? {
        url: fileUrl,
        filename: fileName,
        size: fileSize,
        mimetype: fileType,
      } : null;
      
      const newMessage = await Message.create({
        conversationId,
        senderId,
        receiverId,
        messages: text || "",
        ...(fileObj && { file: fileObj }),
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

  // WebRTC Call Signaling
  
  // Initiate call
  socket.on("call-user", ({ from, to, userInfo }) => {
    console.log(`Call initiated: ${from} -> ${to}`);
    
    if (!from || !to || from === to) {
      socket.emit("call-failed", { reason: "Invalid call parameters" });
      return;
    }
    
    const receiverSocketId = UserSocketMap[to];
    if (!receiverSocketId) {
      socket.emit("call-failed", { reason: "User not online" });
      return;
    }

    // Check if either user is already in a call
    for (const [callId, callData] of activeCalls.entries()) {
      if (callData.caller === from || callData.callee === from || 
          callData.caller === to || callData.callee === to) {
        socket.emit("call-failed", { reason: "User busy" });
        return;
      }
    }

    const callId = `${from}-${to}-${Date.now()}`;
    activeCalls.set(callId, {
      caller: from,
      callee: to,
      status: "ringing",
      createdAt: new Date(),
      timeoutId: null
    });

    io.to(receiverSocketId).emit("incoming-call", {
      callId,
      from,
      userInfo,
    });

    // Set call timeout (30 seconds)
    const timeoutId = setTimeout(() => {
      if (activeCalls.has(callId)) {
        const callData = activeCalls.get(callId);
        if (callData.status === "ringing") {
          console.log(`Call timeout: ${callId}`);
          socket.emit("call-timeout", { callId });
          io.to(receiverSocketId).emit("call-timeout", { callId });
          cleanupCall(callId);
        }
      }
    }, 30000);

    // Store timeout ID for potential cleanup
    activeCalls.get(callId).timeoutId = timeoutId;
  });

  // Accept call
  socket.on("call-accepted", ({ from, to, callId }) => {
    console.log(`Call accepted: ${callId} by ${from}`);
    
    if (!callId || !activeCalls.has(callId)) {
      socket.emit("call-failed", { reason: "Invalid call ID" });
      return;
    }

    const callData = activeCalls.get(callId);
    if (callData.callee !== from) {
      socket.emit("call-failed", { reason: "Unauthorized call acceptance" });
      return;
    }
    
    const callerSocketId = UserSocketMap[to];
    if (callerSocketId) {
      // Clear timeout
      if (callData.timeoutId) {
        clearTimeout(callData.timeoutId);
        callData.timeoutId = null;
      }
      
      // Update call status
      callData.status = "accepted";
      
      io.to(callerSocketId).emit("call-accepted", { from, callId });
    } else {
      socket.emit("call-failed", { reason: "Caller disconnected" });
      cleanupCall(callId);
    }
  });

  // Reject call
  socket.on("call-rejected", ({ from, to, callId }) => {
    console.log(`Call rejected: ${callId} by ${from}`);
    
    const callerSocketId = UserSocketMap[to];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-rejected", { from, callId });
    }
    
    // Clean up call data
    if (callId && activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      if (callData.timeoutId) {
        clearTimeout(callData.timeoutId);
      }
      cleanupCall(callId);
    }
  });

  // WebRTC signaling - Offer
  socket.on("offer", ({ from, to, offer }) => {
    console.log(`WebRTC offer: ${from} -> ${to}`);
    
    if (!from || !to || !offer) {
      socket.emit("call-failed", { reason: "Invalid offer data" });
      return;
    }
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      // Find and update call status
      const callInfo = findCallByParticipants(from, to);
      if (callInfo) {
        callInfo.callData.status = "connecting";
      }
      
      io.to(receiverSocketId).emit("offer", { from, offer });
    } else {
      socket.emit("call-failed", { reason: "User disconnected" });
    }
  });

  // WebRTC signaling - Answer
  socket.on("answer", ({ from, to, answer }) => {
    console.log(`WebRTC answer: ${from} -> ${to}`);
    
    if (!from || !to || !answer) {
      socket.emit("call-failed", { reason: "Invalid answer data" });
      return;
    }
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      // Find and update call status
      const callInfo = findCallByParticipants(from, to);
      if (callInfo) {
        callInfo.callData.status = "connecting";
      }
      
      io.to(receiverSocketId).emit("answer", { from, answer });
    } else {
      socket.emit("call-failed", { reason: "User disconnected" });
    }
  });

  // WebRTC signaling - ICE Candidate
  socket.on("icecandidate", ({ candidate, to }) => {
    console.log(`ICE candidate sent to: ${to}`);
    
    if (!candidate || !to) {
      return; // Silently ignore invalid ICE candidates
    }
    
    const receiverSocketId = UserSocketMap[to];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("icecandidate", { candidate });
    }
  });

  // Call ended
  socket.on("call-ended", ({ to, callId }) => {
    console.log(`Call ended: ${callId || 'by user'}`);
    
    if (callId && activeCalls.has(callId)) {
      const callData = activeCalls.get(callId);
      if (callData.timeoutId) {
        clearTimeout(callData.timeoutId);
      }
      cleanupCall(callId);
    } else if (to) {
      // Legacy cleanup or direct user-to-user cleanup
      const receiverSocketId = UserSocketMap[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("call-ended", { callId });
      }
      
      // Clean up any active calls involving these users
      for (const [id, callData] of activeCalls.entries()) {
        if (callData.caller === userId || callData.callee === userId ||
            callData.caller === to || callData.callee === to) {
          if (callData.timeoutId) {
            clearTimeout(callData.timeoutId);
          }
          cleanupCall(id);
        }
      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${userId}, reason: ${reason}`);
    
    // Clean up user from socket map
    if (userId) {
      delete UserSocketMap[userId];
      
      // Clean up any active calls for this user
      for (const [callId, callData] of activeCalls.entries()) {
        if (callData.caller === userId || callData.callee === userId) {
          if (callData.timeoutId) {
            clearTimeout(callData.timeoutId);
          }
          cleanupCall(callId);
        }
      }
    }
    
    // Broadcast updated online users
    io.emit("OnlineUsers", Object.keys(UserSocketMap));
  });

  // Handle connection errors
  socket.on("connect_error", (error) => {
    console.error(`Socket connection error for user ${userId}:`, error);
  });

  // Heartbeat for connection monitoring
  socket.on("ping", () => {
    socket.emit("pong");
  });

  // Handle any socket errors
  socket.on("error", (error) => {
    console.error(`Socket error for user ${userId}:`, error);
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
      console.log(`Cleaning up stale call: ${callId}`);
      if (callData.timeoutId) {
        clearTimeout(callData.timeoutId);
      }
      staleCallIds.push(callId);
    }
  }
  
  // Clean up stale calls
  staleCallIds.forEach(callId => cleanupCall(callId));
}, 5 * 60 * 1000);

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('Received SIGINT, cleaning up...');
  
  // Clean up all active calls
  for (const [callId, callData] of activeCalls.entries()) {
    if (callData.timeoutId) {
      clearTimeout(callData.timeoutId);
    }
    cleanupCall(callId);
  }
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, cleaning up...');
  
  // Clean up all active calls
  for (const [callId, callData] of activeCalls.entries()) {
    if (callData.timeoutId) {
      clearTimeout(callData.timeoutId);
    }
    cleanupCall(callId);
  }
  
  // Close the server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Error handling for the server
server.on("error", (error) => {
  console.error("Server error:", error);
});

io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

// Log server start
console.log('WebRTC Socket.IO server initialized');

export { io, app, server };