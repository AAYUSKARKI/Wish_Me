import HomePage from '../Requests/Requests';
import Sidebar from '../Sidebar/Sidebar';
const SellerDashboard = () => {

    return (
        <>
       <div className='flex'>
          <Sidebar/>
        <div className="flex dark:bg-gray-950">
            <main className="w-3/4 p-4">
                <h2 className="text-2xl font-bold mb-4">Available Requests</h2>
                <HomePage />
            </main>
        </div>
        </div>
        </>
    );
};

export default SellerDashboard;
