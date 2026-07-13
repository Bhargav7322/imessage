
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5175";

const io = new Server(server, {
  cors: { origin: allowedOrigin, credentials: true },
});

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// online users map = {userId: socketId}

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

  //io.emit() sends event to everyone - broadcast
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket typing events
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId && userId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId && userId) {
      io.to(receiverSocketId).emit("stopTyping", { senderId: userId });
    }
  });

  //socket.on is used to listen for events
  socket.on("disconnect", () => {
    if (userId && userId !== "undefined") delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { server, app, io, getReceiverSocketId };