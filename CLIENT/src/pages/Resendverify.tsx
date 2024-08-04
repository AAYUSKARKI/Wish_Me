import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const ResendVerification = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [Error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleResend = async () => {
        if(!email){
            toast.error('email is required')
            return;
        }
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await axios.post("https://wish-me-65k8.onrender.com/api/v1/users/resend-verification", { email });
            setSuccess(response.data.message);
            toast.success(response.data.message);
        } catch (error:any) {
            setError(error.response?.data?.message || "An error occurred.");
            toast.error(Error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white p-6">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Resend Verification Email</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    If you did not receive the verification email, please enter your email address below to request a new one.
                </p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 dark:bg-gray-700 dark:text-gray-200"
                />
                {Error && <p className="text-red-500 text-sm mb-4">{Error}</p>}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                {success && <Link to='/' className="bg-green-500 text-white p-2">Back To Home</Link>}
                {!success && <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {loading ? "Sending..." : "Send Verification Email"}
                </button>}
            </div>
        </div>
    );
};

export default ResendVerification;
