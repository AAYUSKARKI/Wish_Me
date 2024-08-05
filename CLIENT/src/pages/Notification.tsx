// Notification.js
import React from 'react';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

const Notification = ({ senderName, message, timestamp, avatar }) => {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div className="flex items-start p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200">
      <img 
        src={avatar || 'https://via.placeholder.com/50'} 
        alt="User Avatar" 
        className="w-12 h-12 rounded-full object-cover mr-4" 
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-gray-800">{senderName}</span>
          <span className="text-sm text-gray-500">{timeAgo}</span>
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

Notification.propTypes = {
  senderName: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  avatar: PropTypes.string
};

export default Notification;
