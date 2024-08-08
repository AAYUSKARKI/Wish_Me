import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Chatcard from '../Respondchat/Chatcard';
import moment from 'moment';

interface Participant {
  _id: string;
  username: string;
  avatar: string;
  lastOnline: string;
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
        const res = await axios.get(`https://wish-me-65k8.onrender.com/api/v1/messages/myconvo`);
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
    <div className="dark:bg-gray-950 dark:text-white container mx-auto p-3 w-full">
      <h1 className="text-3xl font-bold mt-8 mb-6">My Conversations</h1>
      <div className="space-y-6">
        {conversations.map((conversation) => {
          const otherParticipant = conversation.participations.find(
            (participant) => participant._id !== user._id
          );

          const isOnline = onlineuser.some((onlineUser: any) => onlineUser._id === otherParticipant?._id);

          return (
            <div 
              key={conversation._id} 
              className="bg-white dark:bg-slate-900 dark:text-white p-5 shadow-lg rounded-lg flex items-center justify-between transition-transform transform hover:scale-105"
            >
              {otherParticipant && (
                <div className="flex items-center cursor-pointer w-full" onClick={() => openChat(otherParticipant)}>
                  <div className="relative mr-4">
                    <div
                      className={`absolute -top-2 -right-2 h-4 w-4 ${isOnline ? 'bg-green-500' : 'bg-red-500'} rounded-full border-2 border-white dark:border-slate-900`}
                    ></div>
                    <img src={otherParticipant.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-slate-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-semibold">{otherParticipant.username}</p>
                      {!isOnline && <p className="text-sm text-gray-500 dark:text-gray-400">{moment(otherParticipant.lastOnline).fromNow()}</p>}
                    </div>
                    {conversation.messages.length > 0 && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2 truncate">
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
