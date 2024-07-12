import express, { urlencoded } from "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config({path : './.env'})
console.log(process.env.CORS_ORIGIN);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
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