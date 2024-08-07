import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { socket } from '../Socket';
import { IoClose, IoSend } from 'react-icons/io5';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  participants: string[];
  messages: Message[];
}

const Chatcard: React.FC<{ popup: boolean,lastOnline:string, creatorName: string, creatorAvatar: string, Buyerid: string, closeChat: () => void }> = ({ popup, Buyerid, closeChat, creatorName, creatorAvatar }) => {
  const { user } = useSelector((state: any) => state.user);
  const [messages, setMessages] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { onlineuser } = useSelector((state: any) => state.onlineuser);
  const isOnline = onlineuser.some((user: any) => user._id === Buyerid);
  const getMessages = async () => {
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`https://wish-me-65k8.onrender.com/api/v1/messages/getmessage/${Buyerid}`);
      setMessages(res.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (Buyerid) {
      getMessages();
    }

    const handleMessage = (data: Message) => {
      console.log('New message received:', data);
      setMessages((prev) => {
        if (!prev) {
          return {
            participants: [data.senderId, data.receiverId],
            messages: [data],
          };
        }
        return {
          ...prev,
          messages: [...prev.messages, data],
        };
      });
    };

    socket.on('newmessage', handleMessage);

    return () => {
      socket.off('newmessage', handleMessage);
    };
  }, [Buyerid]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const messageData = {
        senderId: user._id,
        receiverId: Buyerid,
        message: newMessage,
      };

      await axios.post(`https://wish-me-65k8.onrender.com/api/v1/messages/sendmessage/${Buyerid}`, messageData);
      setNewMessage('');

      // Send notification
      await axios.post('https://wish-me-65k8.onrender.com/sendNotification', {
        title: 'New Message',
        message: newMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div className={`w-full h-full flex items-center justify-center ${popup ? 'block' : 'hidden'}`}>
      <div className="w-full max-w-md bg-white dark:bg-gray-950 rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          <div className="flex items-center mb-4">
            <div className="relative">
              <div
                className={`absolute -top-3 -right-3 h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'} text-white text-xs px-2 py-1 rounded-full`}
              ></div>
              <img
                src={creatorAvatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover mr-2"
              />
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">{creatorName}</span>
            <span>{lastOnline}</span>
          </div>
          <button onClick={closeChat}>
            <IoClose className="text-2xl text-black dark:text-white" />
          </button>
        </div>

        <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4">
          {messages?.messages.map((message: Message) => (
            <div key={message._id} className={`my-2 flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
              {message.senderId !== user._id && (
                <img
                  src={creatorAvatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
              )}
              <div className={`max-w-xs p-2 rounded-lg ${message.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                <p>{message.message}</p>
                <p className="text-xs mt-1">{new Date(message.createdAt).toLocaleTimeString()}</p>
              </div>
              {message.senderId === user._id && (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover ml-2"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center p-4 border-t dark:border-gray-800">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 rounded-lg border dark:border-gray-700"
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-full">
            <IoSend className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatcard;
