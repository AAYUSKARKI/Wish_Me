
const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">Key Features of WishMe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Buyer Dashboard */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Buyer Dashboard</h3>
            <p className="text-gray-700 mb-4">
              Manage your wishes, view offers, and communicate with sellers easily.
            </p>
            {/* Additional details if needed */}
          </div>

          {/* Feature 2: Seller Dashboard */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Seller Dashboard</h3>
            <p className="text-gray-700 mb-4">
              List products, respond to requests, and negotiate with buyers efficiently.
            </p>
            {/* Additional details if needed */}
          </div>

          {/* Feature 3: Real-Time Messaging */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Real-Time Messaging</h3>
            <p className="text-gray-700 mb-4">
              Communicate instantly with sellers to discuss details and finalize transactions.
            </p>
            {/* Additional details if needed */}
          </div>

          {/* Feature 4: Request Posting */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Request Posting</h3>
            <p className="text-gray-700 mb-4">
              Easily post what you're looking for and receive offers from sellers.
            </p>
            {/* Additional details if needed */}
          </div>

          {/* Feature 5: Profile Management */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Profile Management</h3>
            <p className="text-gray-700 mb-4">
              Edit your profile, manage preferences, and track transaction history.
            </p>
            {/* Additional details if needed */}
          </div>

          {/* Feature 6: Responsive Design */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Responsive Design</h3>
            <p className="text-gray-700 mb-4">
              Access WishMe seamlessly across devices with responsive and intuitive UI.
            </p>
            {/* Additional details if needed */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
