import axios from "axios";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setuser } from "../../components/Redux/Userslice"; // Adjust the import path as needed
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

interface LoginData {
    email: string;
    password: string;
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const dispatch = useDispatch();

    useEffect(() => {
        setError('');
    }, [loginData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!emailRegex.test(loginData.email)) {
            toast.error("Please enter a valid email address");
            setError("Please enter a valid email address");
            return;
        }

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill in both fields");
            setError("Please fill in both fields");
            return;
        }

        try {
            setLoading(true);
            axios.defaults.withCredentials = true;
            const res = await axios.post('http://localhost:7000/api/v1/users/login', loginData);
            const { accesstoken, user } = res.data.data;

            // Store the access token in cookies
            Cookies.set("accessToken", accesstoken, { expires: 1, secure: true, sameSite: 'None' });

            // Dispatch setUser with user data
            dispatch(setuser(user));

            // Set the Axios authorization header with the bearer token
            axios.defaults.headers.common["Authorization"] = `Bearer ${accesstoken}`;

            toast.success(res.data.message);
            if (user.role === 'seller') {
                navigate('/seller-dashboard');
            } else {
                navigate('/buyer-dashboard');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen dark:bg-gray-950 flex flex-col items-center justify-center">
            <div className="dark:bg-slate-800 dark:text-white flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-6">Login</h1>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="relative dark:text-white">
                            <label className="text-gray-700 dark:text-white" htmlFor="email">Email</label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-3 dark:text-slate-600 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full dark:bg-slate-700 dark:text-white pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-gray-700 dark:text-white" htmlFor="password">Password</label>
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-3 text-gray-500 dark:text-slate-600" />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full dark:text-white dark:bg-slate-700 pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                            <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-600 mt-3 text-right">Forgot password?</Link>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-gray-600 dark:text-white">Don't have an account? <Link to="/register" className="text-indigo-600 dark:text-indigo-400">Register</Link></p>
            </div>
            <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
                        <div className="flex">
                            <div className="py-1"><svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" /></svg></div>
                            <div>
                                <p className="font-bold">Only Verified Account can Login Now</p>
                                <p className="text-sm">Make sure your account is verified</p>
                                <Link className="bg-teal-500 text-center text-white p-1 rounded-3xl cursor-pointer" to='/resend-verification'>Verify Now</Link>
                            </div>
                        </div>
                    </div>
        </div>
    );
}

export default Login;
