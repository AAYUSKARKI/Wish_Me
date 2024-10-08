import { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from '../Sidebar/Sidebar';
const Setting = () => {

  const { user } = useSelector((state: any) => state.user);
  const [profile, setProfile] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    activity: [
      { id: 1, action: 'Posted a request for a Laptop' },
      { id: 2, action: 'Received a response for a Smartphone' }
    ]
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e:any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Handle form submission
    setEditMode(false);
  };

  return (
    <div className='flex'>
      <Sidebar/>
    <div className="w-450px md:w-[890px] mx-auto p-6 bg-slate-50 rounded-2xl shadow-3xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
      {editMode ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={profile.username}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Role</label>
            <select
              name="role"
              value={profile.role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Save</button>
        </form>
      ) : (
        <>
        <img className="w-32 h-32 rounded-full mb-4 bg-gray-900" src={user.avatar} alt="" />
          <p><strong>Name:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <button onClick={handleEdit} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Edit Profile</button>
          <h3 className="text-xl font-bold mt-6 mb-4">Past Activity</h3>
          <ul>
            {profile.activity.map((activity) => (
              <li key={activity.id} className="mb-2">{activity.action}</li>
            ))}
          </ul>
        </>
      )}
    </div>
    </div>
  );
};

export default Setting;
