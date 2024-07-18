import Header from "../../components/Header/Header";
import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setuser } from "../../components/Redux/Userslice"; // Adjust the import path as needed
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface LoginData {
    email: string;
    password: string;
}

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState<LoginData>({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            toast.error("Please fill in both fields");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post('http://localhost:7000/api/v1/users/login', loginData);
            const { accesstoken, user } = res.data.data;

            // Store the access token in cookies
            Cookies.set("accessToken", accesstoken);

            // Dispatch setUser with user data
            dispatch(setuser(user));

            // Set the Axios authorization header with the bearer token
            axios.defaults.headers.common["Authorization"] = `Bearer ${accesstoken}`;

            toast.success("res.data.message");
            if(user.role==='seller'){
            navigate('/seller-dashboard');
            }
            else{
                navigate('/buyer-dashboard'); 
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <Header />
            <div className="dark:bg-slate-800 flex flex-col items-center justify-center w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold dark:text-white text-gray-800 mb-6">Login</h1>
                <form className="w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="relative">
                            <label className="text-gray-700" htmlFor="email">Email</label>
                            <div className="relative flex items-center">
                                <FaUser className="absolute left-3 text-gray-500" />
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-gray-700" htmlFor="password">Password</label>
                            <div className="relative flex items-center">
                                <FaLock className="absolute left-3 text-gray-500" />
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
            <p className="mt-4 bg-white dark:bg-gray-950 text-gray-600 dark:text-white">Don't have an account? <a href="/register" className="text-indigo-600 dark:text-indigo-400">Register</a></p>
        </div>
    );
}

export default Login;