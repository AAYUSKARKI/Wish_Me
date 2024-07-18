import { Link } from 'react-router-dom';
import HomePage from '../Requests/Requests';
const SellerDashboard = () => {

    return (
        <div className="flex">
            <aside className="w-1/4 bg-gray-100 p-4">
                <ul>
                    <li className="mb-2"><a href="#" className="text-blue-500">Browse Requests</a></li>
                    <li className="mb-2"><Link to="/my-conversations">Listings</Link></li>
                    <li className="mb-2"><Link to="/profile">Profile</Link></li>
                    <li className="mb-2"><a href="#">Settings</a></li>
                    <li className="mb-2">Logout</li>
                </ul>
            </aside>
            <main className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-4">Available Requests</h2>
                <HomePage />
            </main>
        </div>
    );
};

export default SellerDashboard;
