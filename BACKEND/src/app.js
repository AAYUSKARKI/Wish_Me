import express, { urlencoded } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
app.use(express.urlencoded({extended:true,limit:"16kb"}))
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
export { app }