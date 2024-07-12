import { useState } from 'react';

const BuyerDashboard = () => {
  const [requests, setRequests] = useState([
    // Sample data
    { id: 1, item: 'Laptop', status: 'Pending' },
    { id: 2, item: 'Smartphone', status: 'Accepted' }
  ]);

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-100 p-4">
        <ul>
          <li className="mb-2"><a href="#" className="text-blue-500">My Requests</a></li>
          <li className="mb-2"><a href="#">Responses</a></li>
          <li className="mb-2"><a href="#">Profile</a></li>
          <li className="mb-2"><a href="#">Settings</a></li>
        </ul>
      </aside>
      <main className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Current Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.id} className="mb-4 p-4 bg-white rounded shadow">
              <p>Item: {request.item}</p>
              <p>Status: {request.status}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default BuyerDashboard;
