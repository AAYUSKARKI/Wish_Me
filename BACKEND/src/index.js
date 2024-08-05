// index.js
import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { User } from "./models/user.model.js"; // Import User model
import { Notification } from "./models/notification.model.js";
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
    console.log("MongoDB connected");

    io.on("connection", async (socket) => {
      console.log(`User Connected: ${socket.id}`);
    
      // Handle online event
      socket.on('online', async (userId) => {
        try {
          const user = await User.findById(userId);
          if (user) {
            onlineUsers.set(socket.id, user);
            userIdToSocketId.set(userId, socket.id); // Store reverse mapping
            console.log(`User ${user.username} (${userId}) is online`);
    
            // Update user online status and last online time
            user.onlineStatus = true;
            user.lastOnline = new Date();
            await user.save();
    
            // Broadcast updated user list to all clients
            io.emit('userList', Array.from(onlineUsers.values()));
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

  const sendMessageToUser = async(userId, event, message,senderId) => {
    console.log(senderId)
    console.log('user to socket  is', userIdToSocketId);
    console.log(userId);
    const socketId = userIdToSocketId.get(userId); // Get socketId from reverse map
    console.log(socketId);
    const senderSocketId = userIdToSocketId.get(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit(event, message);
    }
    if (socketId) {
      io.to(socketId).emit(event, message);
      const sender = await User.findById(senderId);
      const notification = await Notification.create({
        userId: userId, // User receiving the message
        senderId: senderId, // User sending the message
        message: `New message from ${sender.username}`, // Customize the message
      });
    
      
      // Notify the user via Socket.IO
      io.to(socketId).emit('notification', {
        sendername: sender.username,
        message: `New message from ${sender.username}`,
        avatar: sender.avatar,
        timestamp: notification.createdAt
      });
    } else {
      console.log(`User with ID ${userId} is not connected`);
    }
  };
  
export { io , sendMessageToUser};
