import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function VerifyEmail() {
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get("verifyToken");
        if (token) {
            axios.post(`http://localhost:7000/api/v1/users/verifyaccount/${token}`)
                .then(res => {
                    setMessage(res.data.message);
                    toast.success(res.data.message);
                    navigate("/login");
                })
                .catch(error => {
                    setMessage(error.response.data.message);
                    toast.error(error.response.data.message);
                })
                .finally(() => setLoading(false));
        } else {
            setMessage("Invalid verification link.");
            setLoading(false);
        }
    }, [location.search, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white p-6">
            {loading ? (
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 016.293-7.708A4.978 4.978 0 0012 4a5 5 0 00-5 5c0 .55.09 1.075.262 1.564A8 8 0 014 12z"></path>
                    </svg>
                    <p className="text-lg font-medium">Verifying...</p>
                </div>
            ) : (
                <div className="text-center max-w-lg w-full p-4 bg-white shadow-md rounded-lg dark:bg-gray-800">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Email Verification</h1>
                    <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                        {message || "Please check your email and follow the instructions to verify your account."}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        If you did not receive an email, check your spam folder or <a href="/resend-verification" className="text-blue-500 hover:underline">request a new one</a>.
                    </p>
                </div>
            )}
        </div>
    );
}

export default VerifyEmail;
