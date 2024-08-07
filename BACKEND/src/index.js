// index.js
import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { User } from "./models/user.model.js"; // Import User model
import { Notification } from "./models/notification.model.js";
import mongoose from "mongoose";
dotenv.config({ path: './.env' });

const allowedOrigins = ['https://wish-me-liard.vercel.app', 'http://localhost:5173', 'https://knowledge-bridge-rouge.vercel.app'];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
});


// Maintain a map to store online users
const onlineUsers = new Map();
const userIdToSocketId = new Map();
// MongoDB connection
connectdb()
  .then(() => {
    // console.log("MongoDB connected");

    io.on("connection", async (socket) => {
      console.log(`User Connected: ${socket.id}`);
    
      // Handle online event
      socket.on('online', async (userId) => {
        console.log(userId,'is user id')
        try {
          const user = await User.findById(userId);
          if (user) {
            onlineUsers.set(socket.id, user);
            console.log(onlineUsers,'is online users')
            userIdToSocketId.set(userId, socket.id); // Store reverse mapping
            console.log(`User ${user.username} (${userId}) is online`);
            console.log(`Mapped user ${user.username} (${userId}) to socket ID ${socket.id}`);
          
            // Update user online status and last online time
            user.onlineStatus = true;
            user.lastOnline = new Date();
            await user.save();
    
            // Broadcast updated user list to all clients
            io.emit('userList', Array.from(onlineUsers.values()));
            // console.log('Current userIdToSocketId map after online event:', Array.from(userIdToSocketId.entries()));
          }
        } catch (err) {
          console.error(`Error finding user ${userId}:`, err);
        }
        
      });
    
      // Handle disconnect event
      socket.on("disconnect", async () => {
        const user = onlineUsers.get(socket.id);
        if (user) {
          console.log(`User ${user.username} (${user._id}) disconnected`);
    
          // Update user online status and last online time
          user.onlineStatus = false;
          user.lastOnline = new Date();
          await user.save();
    
          onlineUsers.delete(socket.id);
          userIdToSocketId.delete(user._id.toString()); // Remove reverse mapping
    
          // Broadcast updated user list to all clients
          io.emit('userList', Array.from(onlineUsers.values()));
        } else {
          console.log(`User disconnected with unknown user ID: ${socket.id}`);
        }
      });
    
      // Initial user list when a new client connects
      socket.emit('userList', Array.from(onlineUsers.values()));
    });
    

    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
  });

  const sendMessageToUser = async (userId, event, message, senderId) => {
    console.log('Sending message to users:');
    console.log('Current userIdToSocketId map:', Array.from(userIdToSocketId.entries()));
  
    // Convert ObjectId to string if necessary
    const senderIdString = senderId instanceof mongoose.Types.ObjectId ? senderId.toString() : senderId;
    const receiverIdString = userId instanceof mongoose.Types.ObjectId ? userId.toString() : userId;
  
    console.log('Sender ID:', senderIdString);
    console.log('Receiver ID:', receiverIdString);
  
    const senderSocketId = userIdToSocketId.get(senderIdString);
    const receiverSocketId = userIdToSocketId.get(receiverIdString);
  
    console.log('Sender Socket ID:', senderSocketId);
    console.log('Receiver Socket ID:', receiverSocketId);
  
    if (senderSocketId) {
      io.to(senderSocketId).emit(event, message);
    } else {
      console.log(`Sender with ID ${senderIdString} is not connected or not found in map.`);
    }
  
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(event, message);
      const sender = await User.findById(senderIdString);
      const notification = await Notification.create({
        userId: receiverIdString,
        senderId: senderIdString,
        message: `New message from ${sender.username}`,
      });
  
      io.to(receiverSocketId).emit('notification', {
        sendername: sender.username,
        message: `New message from ${sender.username}`,
        avatar: sender.avatar,
        timestamp: notification.createdAt,
      });
    } else {
      console.log(`Receiver with ID ${receiverIdString} is not connected or not found in map.`);
    }
  };
  
  
  
export { io , sendMessageToUser};
