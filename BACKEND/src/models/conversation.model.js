import mongoose, { Schema } from 'mongoose'

const conversationschema = new Schema(
    {
        participations: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
        messages: [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Message",
        }],
    },
    {
        timestamps: true
    }

)

export const Conversation  = mongoose.model("Conversation", conversationschema)