

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Step 1: Sign Up</h3>
            <p>Create an account to get started with WishMe.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Step 2: Post Requests</h3>
            <p>Post what you're looking for, and sellers will respond.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Step 3: Communicate</h3>
            <p>Communicate with sellers through our messaging system.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
