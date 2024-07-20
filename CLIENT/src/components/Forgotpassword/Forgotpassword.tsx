// src/components/ForgotPassword.jsx
import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials=true
      const response = await axios.post('https://wish-me-65k8.onrender.com/api/v1/users/forgetpassword', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error sending email. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-950">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md dark:bg-gray-800">
        <h2 className="text-xl mb-4 dark:text-white">Forgot Password</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
