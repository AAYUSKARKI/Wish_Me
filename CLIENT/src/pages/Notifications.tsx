// components/NotificationList.tsx
import React, { useEffect, useState } from 'react';
import { socket } from '../components/Socket/index';
import Sidebar from '../components/Sidebar/Sidebar';

interface Notification {
    senderName: string;
    message: string;
    avatar: string;
    timestamp: string;
  }

  // utils/notification.ts
const sendNotification = async (title: string, message: string) => {
    try {
      const response = await fetch('http://localhost:7000/sendNotification', {
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
    socket.on('notification', (data: Notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, data]);
    });

    sendNotification('New Notification', 'You have a new notification!');
    return () => {
      socket.off('notification');
    };
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