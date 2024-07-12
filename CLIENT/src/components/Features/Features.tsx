const FeaturesSection = () => {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Key Benefits and Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Feature 1</h3>
              <p>Detailed description of feature 1.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Feature 2</h3>
              <p>Detailed description of feature 2.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Feature 3</h3>
              <p>Detailed description of feature 3.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturesSection;
  