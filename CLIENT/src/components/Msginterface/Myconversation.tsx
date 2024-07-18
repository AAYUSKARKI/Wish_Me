import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Chatcard from '../Respondchat/Chatcard';

interface Participant {
  _id: string;
  username: string;
  avatar: string;
}

interface Message {
  _id: string;
  message: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participations: Participant[];
  messages: Message[];
}

const MyConversations: React.FC = () => {
  const { user } = useSelector((state: any) => state.user); // Assuming you have a user state in Redux
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Participant | null>(null);
  const [popup, setPopup] = useState(false);
  const { onlineuser } = useSelector((state: any) => state.onlineuser);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.get(`http://localhost:7000/api/v1/messages/myconvo`);
        setConversations(res.data.conversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, []);

  const openChat = (participant: Participant) => {
    setSelectedConversation(participant);
    setPopup(true);
  };

  const closeChat = () => {
    setPopup(false);
    setSelectedConversation(null);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mt-8 mb-4">My Conversations</h1>
      <div className="grid gap-4">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participations.find(
            (participant) => participant._id !== user._id
          );

          const isOnline = onlineuser.some((onlineUser: any) => onlineUser._id === otherParticipant?._id);

          return (
            <div key={conversation._id} className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
              {/* Participant Info */}
              {otherParticipant && (
                <div className="flex items-center cursor-pointer" onClick={() => openChat(otherParticipant)}>
                  <div className="relative">
                    <div
                      className={`absolute -top-3 -right-3 h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full`}
                    ></div>
                    <img src={otherParticipant.avatar} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{otherParticipant.username}</p>
                    {/* Displaying the last message */}
                    {conversation.messages.length > 0 && (
                      <p className="text-gray-500">
                        {conversation.messages[conversation.messages.length - 1].message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {selectedConversation && (
        <Chatcard
          popup={popup}
          Buyerid={selectedConversation._id}
          closeChat={closeChat}
          creatorName={selectedConversation.username}
          creatorAvatar={selectedConversation.avatar}
        />
      )}
    </div>
  );
};

export default MyConversations;
