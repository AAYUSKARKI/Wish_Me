import { useState } from 'react';

const SellerDashboard = () => {
    const [requests, setRequests] = useState([
        // Sample data
        { id: 1, item: 'Laptop', buyer: 'User 1', price: '$1000' },
        { id: 2, item: 'Smartphone', buyer: 'User 2', price: '$500' }
    ]);

    return (
        <div className="flex">
            <aside className="w-1/4 bg-gray-100 p-4">
                <ul>
                    <li className="mb-2"><a href="#" className="text-blue-500">Browse Requests</a></li>
                    <li className="mb-2"><a href="#">My Listings</a></li>
                    <li className="mb-2"><a href="#">Profile</a></li>
                    <li className="mb-2"><a href="#">Settings</a></li>
                </ul>
            </aside>
            <main className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-4">Available Requests</h2>
                <ul>
                    {requests.map((request) => (
                        <li key={request.id} className="mb-4 p-4 bg-white rounded shadow">
                            <p>Item: {request.item}</p>
                            <p>Buyer: {request.buyer}</p>
                            <p>Price: {request.price}</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Respond</button>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
};

export default SellerDashboard;
