const TestimonialsSection = () => {
    return (
      <section className="py-20 bg-white dark:bg-gray-950 dark:text-white">
        <div className="container mx-auto text-center dark:bg-gray-950">
          <h2 className="text-3xl font-bold mb-10">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 dark:bg-slate-900">
            <div className="p-6 bg-gray-100 rounded-lg shadow-md dark:bg-slate-900">
              <p className="italic">"This platform has transformed my buying experience!"</p>
              <p className="mt-4 font-bold">- User 1</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md dark:bg-slate-900">
              <p className="italic">"An amazing tool for sellers to reach more customers."</p>
              <p className="mt-4 font-bold">- User 2</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-md dark:bg-slate-900">
              <p className="italic">"Easy to use and very effective."</p>
              <p className="mt-4 font-bold">- User 3</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default TestimonialsSection;
  