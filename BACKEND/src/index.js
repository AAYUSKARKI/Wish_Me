// index.js
import dotenv from "dotenv";
import connectdb from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { User } from "./models/user.model.js"; // Import User model
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

// MongoDB connection
connectdb()
  .then(() => {
    console.log("MongoDB connected");

    // Socket.IO connection handler
    io.on("connection", async (socket) => {
      console.log(`User Connected: ${socket.id}`);

      // Handle online event
      socket.on('online', async (userId) => {
        try {
          const user = await User.findById(userId);
          if (user) {
            onlineUsers.set(socket.id, user);
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

export { io };
