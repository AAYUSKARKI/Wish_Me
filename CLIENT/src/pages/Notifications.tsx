// components/NotificationList.tsx
import React, { useEffect, useState } from 'react';
import { socket } from '../components/Socket/index';
import Sidebar from '../components/Sidebar/Sidebar';
import axios from 'axios'
interface Notification {
    senderName: string;
    message: string;
    avatar: string;
    timestamp: string;
  }
  // utils/notification.ts
const sendNotification = async (title: string, message: string) => {
    try {
      const response = await fetch('https://wish-me-65k8.onrender.com/sendNotification', {
        method: 'POST',
        body: JSON.stringify({ title, message }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
  
      console.log('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const handleNotification = (data: Notification) => {
      console.log('handling notifications')
      setNotifications((prevNotifications) => [...prevNotifications, data]);
      sendNotification('New Notification', 'You have a new notification!');
    };
  
    socket.on('notification', handleNotification);
    socket.on('new-notification', handleNotification);
  
    return () => {
      socket.off('notification', handleNotification);
      socket.off('new-notification', handleNotification);
    };
  }, []);

  const getNotifications = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get('https://wish-me-65k8.onrender.com/api/v1/comments/abc/cde/notifications');

      console.log(response.data.data);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);
  return (
    <>
    <Sidebar/>
    <div className="absolute top-[3.4rem] right-0 p-4 w-80 h-screen dark:bg-gray-950 bg-white shadow-lg">
      {notifications.length === 0 ? (
        <p className='text-black dark:text-white'>No new notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <div
            key={index}
            className="flex items-center p-2 mb-2 bg-gray-100 rounded-lg border border-gray-200"
          >
            <img
              src={notification.avatar}
              alt={notification.senderName}
              className="w-12 h-12 rounded-full object-cover mr-2"
            />
            <div>
              <p className="font-semibold">{notification.senderName}</p>
              <p>{notification.message}</p>
              <p className="text-sm text-gray-500">{new Date(notification.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default NotificationList;