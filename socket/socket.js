// socketServer.js (replace your existing file)
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
  // allow polling fallback as well (more resilient). If you intentionally
  // need websocket-only, change back.
  transports: ["websocket", "polling"],
});

// Use Maps for safer operations
const UserSocketMap = new Map(); // userId -> socketId
const SocketUserMap = new Map(); // socketId -> userId (for cleanup)
const CallStates = new Map(); // userId -> callState

// Typing debounce maps: prevents spamming 'typing' to the recipient
const TypingState = new Map(); // `${from}:${to}` -> { lastSentAt, timer }

// Message-seen dedupe: avoid multiple DB updates and emits for same message
const SeenCache = new Set(); // messageId set of already-processed seen messages

export const getReceiverSocketId = (receiverId) => UserSocketMap.get(receiverId);

io.on("connection", (socket) => {
  // Support both handshake.auth (recommended) and handshake.query
  const userId =
    socket.handshake.auth?.userId ||
    socket.handshake.query?.userId ||
    null;

  if (userId) {
    UserSocketMap.set(userId.toString(), socket.id);
    SocketUserMap.set(socket.id, userId.toString());
    console.log("User connected:", userId, socket.id);
  } else {
    console.log("Socket connected without userId:", socket.id);
  }

  // Broadcast current online user IDs
  io.emit("OnlineUsers", Array.from(UserSocketMap.keys()));



  // MARK: Message seen (deduped)
  socket.on("message-seen", async (messageId) => {
    try {
      if (!messageId) return;
      // Deduplicate repeated 'seen'
      if (SeenCache.has(messageId)) {
        // already handled recently — ignore
        return;
      }
      SeenCache.add(messageId);
      // remove from cache after short time to allow re-seen later if needed
      setTimeout(() => SeenCache.delete(messageId), 10 * 1000); // 10s

      // Update DB
      await Message.findByIdAndUpdate(messageId, { status: "seen" });
      const msg = await Message.findById(messageId).lean();
      if (!msg) return;

      const senderSocket = UserSocketMap.get(msg.senderId?.toString());
      if (senderSocket) {
        io.to(senderSocket).emit("message-status-updated", msg);
      }
    } catch (err) {
      console.error("message-seen error:", err?.message || err);
    }
  });

  // MARK: Send message
  socket.on("send-message", async (payload) => {
    try {
      const { conversationId, receiverId, text, tempId, fileUrl, fileType, fileName, fileSize } = payload;
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
      socket.emit("send-message-error", { message: "Internal server error", tempId: payload?.tempId });
    }
  });

  // Typing indicators (debounced/coalesced on server)
  socket.on("typing", ({ to, from, username } = {}) => {
    if (!to || !from) return;
    const key = `${from}:${to}`;
    const now = Date.now();

    const state = TypingState.get(key);
    // Only forward typing if it's been >300ms since last forward to reduce spam
    if (!state || now - state.lastSentAt > 300) {
      const receiverSocketId = UserSocketMap.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { from, username });
      }
      TypingState.set(key, { lastSentAt: now, timer: null });
    }

    // Always (re)start a timer to emit stop-typing after inactivity
    if (state?.timer) clearTimeout(state.timer);
    const timer = setTimeout(() => {
      const receiverSocketId = UserSocketMap.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stop-typing", { from });
      }
      TypingState.delete(key);
    }, 2000); // 2s inactivity -> stop-typing
    TypingState.set(key, { lastSentAt: now, timer });
  });

  socket.on("stop-typing", ({ to } = {}) => {
    if (!to || !userId) return;
    const key = `${userId}:${to}`;
    const receiverSocketId = UserSocketMap.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", { from: userId });
    }
    const state = TypingState.get(key);
    if (state?.timer) {
      clearTimeout(state.timer);
    }
    TypingState.delete(key);
  });


  // Disconnect handling
  socket.on("disconnect", () => {
    const uid = SocketUserMap.get(socket.id);
    console.log("User disconnected:", uid || socket.id);

    if (uid) {
      // Clean up active calls for this user
      const userCalls = Array.from(CallStates.entries()).filter(([key, value]) =>
        value.caller === uid || value.callee === uid
      );

      userCalls.forEach(([key, callState]) => {
        const targetId = callState.caller === uid ? callState.callee : callState.caller;
        const targetSocketId = UserSocketMap.get(targetId);
        if (targetSocketId) {
          io.to(targetSocketId).emit("user-disconnected", {
            userId: uid,
            reason: "User disconnected",
          });
        }
        CallStates.delete(key);
      });

      UserSocketMap.delete(uid);
    }

    SocketUserMap.delete(socket.id);
    io.emit("OnlineUsers", Array.from(UserSocketMap.keys()));
  });
});

export { io, app, server };
