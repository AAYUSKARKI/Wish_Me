import React from 'react';
import HomePage from '../Requests/Requests';
import Sidebar from '../Sidebar/Sidebar';

const SellerDashboard: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <Sidebar />
      <div className="flex flex-col dark:bg-gray-950 w-full">
        <main className="p-4 flex-grow">
          <h2 className="text-2xl dark:text-white font-bold mb-4">Available Requests</h2>
          <HomePage />
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
