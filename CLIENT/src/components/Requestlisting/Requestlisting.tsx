import { useState } from 'react';

const RequestListingPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: '',
    datePosted: ''
  });

  const handleChange = (e:any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const requests = [
    // Sample data
    { id: 1, item: 'Laptop', category: 'Electronics', location: 'New York', price: '$1000', date: '2024-07-10' },
    { id: 2, item: 'Smartphone', category: 'Electronics', location: 'Los Angeles', price: '$500', date: '2024-07-11' }
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Requests</h2>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="priceRange"
            placeholder="Price Range"
            value={filters.priceRange}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            name="datePosted"
            value={filters.datePosted}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-xl font-bold">{request.item}</h3>
            <p>Category: {request.category}</p>
            <p>Location: {request.location}</p>
            <p>Price: {request.price}</p>
            <p>Date Posted: {request.date}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestListingPage;
