import express, { urlencoded } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import webPush from 'web-push'
const app = express();
dotenv.config({path : './.env'})
const allowedOrigins = ['https://wish-me-liard.vercel.app', 'http://localhost:5173','https://knowledge-bridge-rouge.vercel.app'];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo'],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import messageRouter from './routes/message.routes.js'
import requestRouter from './routes/request.routes.js'
//routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/messages",messageRouter)
app.use("/api/v1/requests",requestRouter)

const vapidKeys = {
  publicKey: process.env.publicKey,
  privateKey: process.env.privateKey,
};

webPush.setVapidDetails(
  'mailto:karki.aayush2003@icloud.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

let subscriptions = []; // Store subscriptions

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/sendNotification', (req, res) => {
  const { title, message } = req.body;

  const payload = JSON.stringify({ title, message });

  Promise.all(subscriptions.map(sub =>
    webPush.sendNotification(sub, payload)
  ))
    .then(() => res.status(200).json({ message: 'Notification sent' }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to send notification' });
    });
});
export { app }