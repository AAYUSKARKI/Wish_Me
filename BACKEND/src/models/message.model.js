import mongoose, { Schema } from 'mongoose'

const messageschema = new Schema(
    {
        senderId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        receiverId: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        message:{
            type:String,
            required:true
        },
        seen:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }

)

export const Message = mongoose.model("Message", messageschema)