import HomePage from '../Requests/Requests';
const SellerDashboard = () => {

    return (
        <div className="flex">
            <main className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-4">Available Requests</h2>
                <HomePage />
            </main>
        </div>
    );
};

export default SellerDashboard;
