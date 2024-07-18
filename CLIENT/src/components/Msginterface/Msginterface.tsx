import { useState } from 'react';

const MessagingInterface = () => {
  const [conversations, setConversations] = useState([
    // Sample data
    { id: 1, user: 'User 1', message: 'Hello, I am interested in your request.' },
    { id: 2, user: 'User 2', message: 'Can we discuss the details?' }
  ]);

  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    // Handle sending message
    setConversations([...conversations, { id: 3, user: 'You', message: currentMessage }]);
    setCurrentMessage('');
  };

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100 p-4">
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id} className="mb-2 p-2 bg-white rounded shadow">
              <p><strong>{conversation.user}</strong></p>
              <p>{conversation.message}</p>
            </li>
          ))}
        </ul>
      </aside>
      <main className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Chat</h2>
        <div className="p-4 bg-white rounded shadow mb-4">
          {/* Display selected conversation messages */}
          <p><strong>User 1:</strong> Hello, I am interested in your request.</p>
          <p><strong>You:</strong> Great, let's discuss further.</p>
        </div>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <button onClick={handleSendMessage} className="w-full bg-blue-500 text-white p-2 rounded">Send</button>
      </main>
    </div>
  );
};

export default MessagingInterface;
