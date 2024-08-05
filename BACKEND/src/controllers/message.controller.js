import { asynchandler } from "../utils/asynchandler.js";
import { Apiresponse } from "../utils/apiresponse.js";
import { Message } from "../models/message.model.js";
import { io } from "../index.js";
import { Conversation } from "../models/conversation.model.js";
import { sendMessageToUser } from "../index.js";

const sendmessage = asynchandler(async(req,res)=>{
    const senderId = req.user._id;
    console.log(senderId,'is the sender id')
    console.log('req.user is',req.user)
    const receiverId = req.params.id;
    console.log('req.params is ',req.params)
    console.log(receiverId,'is the receiver id')
    const {message} = req.body;
    console.log(message)
    let getConversation = await Conversation.findOne({
        participations:{$all : [senderId,receiverId]}
    })

    if(!getConversation){
        getConversation = await Conversation.create({
            participations:[senderId,receiverId],
            messages: []
        })
    }

    const newmessage = await Message.create({
        senderId,
        receiverId,
        message
    })

    // io.emit('newmessage',newmessage)
    console.log('new message is ',newmessage)

      // Emit the message to the specific user
  sendMessageToUser(receiverId, 'newmessage', newmessage,senderId);
    if (newmessage) {
        getConversation.messages = getConversation.messages || []; 
        getConversation.messages.push(newmessage._id);
    }
    await getConversation.save()

    return res.status(201).json(
        new Apiresponse(200, newmessage , "message sent sucesfully")
    )

})

const getmessage = asynchandler(async(req,res)=>{
    const senderId = req.user._id;
    const receiverId = req.params.id;
    let conversation = await Conversation.findOne({
        participations:{$all : [senderId,receiverId]}
    }).populate("messages")

    return res.status(201).json(
        new Apiresponse(200, conversation, "message fetched sucesfully")
    )
})

// Fetch all conversations/messages for a user
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch conversations where userId is either senderId or receiverId
        const conversations = await Conversation.find({
            participations: userId // Check if userId is in the participations array
        })
            .sort({ updatedAt: -1 }) // Sort by most recent message
            .populate({
                path: 'participations',
                select: 'username avatar' // Populate participations with username and avatar
            })
            .populate({
                path: 'messages',
                populate: {
                    path: 'senderId receiverId',
                    select: 'username avatar' // Populate senderId and receiverId fields in messages
                }
            })
            .exec();

        res.json({ conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};
  
const handleSeen = async (req, res) => {
        try {
            const { conversationId } = req.params;
    
            const conversation = await Conversation.findById(conversationId);
            if (!conversation) return res.status(404).send({ error: 'Conversation not found' });
    
            await Message.updateMany(
                { _id: { $in: conversation.messages }, receiverId: req.user._id, seen: false },
                { $set: { seen: true } }
            );
    
            res.status(200).send({ message: 'Messages marked as seen' });
    
            // Emit the messages seen event
            socket.to(conversation.participations).emit('messagesSeen', { conversationId });
        } catch (error) {
            res.status(500).send({ error: 'Failed to mark messages as seen' });
        }
    };

export {
    sendmessage,
    getmessage,
    getConversations,
    handleSeen
}