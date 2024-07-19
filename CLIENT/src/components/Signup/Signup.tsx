import Header from "../../components/Header/Header";
import axios from "axios";
import toast from "react-hot-toast";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useState, ChangeEvent, FormEvent } from "react";
import { Link,useNavigate } from "react-router-dom";

interface User {
    email: string;
    username: string;
    password: string;
    role: string;
    sellerCategory: string[];
}

function Signup() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User>({
        email: "",
        username: "",
        password: "",
        role: "seller",
        sellerCategory: [],
    });

    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [buyer, setBuyer] = useState(false);
    const [categoryInput, setCategoryInput] = useState("");

    const handleSeller = () => {
        setBuyer(false);
        setUser({
            ...user,
            role: "seller",
        });
    };

    const handleBuyer = () => {
        setBuyer(true);
        setUser({
            ...user,
            role: "buyer",
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCategory = () => {
        if (categoryInput.trim() && !user.sellerCategory.includes(categoryInput.trim())) {
            setUser({
                ...user,
                sellerCategory: [...user.sellerCategory, categoryInput.trim()],
            });
            setCategoryInput("");
        }
    };

    const handleRemoveCategory = (category: string) => {
        setUser({
            ...user,
            sellerCategory: user.sellerCategory.filter(cat => cat !== category),
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user.email || !user.username || !user.password ||  (!buyer && !user.sellerCategory)) {
            toast.error("Please fill all the required fields");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            if (avatar) formData.append("avatar", avatar);
            formData.append("email", user.email);
            formData.append("username", user.username);
            formData.append("password", user.password);
            formData.append("role", user.role);

            if (user.role === "seller") {
                formData.append("sellerCategory", JSON.stringify(user.sellerCategory));
            }

            const res = await axios.post('http://localhost:7000/api/v1/users/register', formData);
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/login");
            } else {
                toast.error("Failed to register. Please try again.");
            }
            
        } catch (error: any) {
            console.log(error.response);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <Header />
            <div className="dark:bg-gray-950 dark:text-gray-100 w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
                <div className="dark:bg-gray-950 dark:text-gray-100 absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4 py-4 bg-white rounded-b-lg shadow-md">
                    <h1
                        onClick={handleSeller}
                        className={`cursor-pointer text-sm md:text-xl font-bold ${!buyer ? "text-green-500" : "text-gray-500"}`}
                    >
                        Sign Up As A seller
                    </h1>
                    <h1
                        onClick={handleBuyer}
                        className={`cursor-pointer text-sm md:text-xl font-bold ${buyer ? "text-green-500" : "text-gray-500"}`}
                    >
                        Sign Up As A Buyer
                    </h1>
                </div>
                <h1 className="text-xl md:text-3xl md:font-bold text-gray-800 mt-12 mb-6">You are signing as a {user.role}</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center">
                        <label htmlFor="avatar" className="cursor-pointer flex flex-col items-center">
                            <IoCloudUploadOutline className="text-3xl text-gray-500" />
                            <span className="text-gray-500">Upload Avatar</span>
                        </label>
                        <input type="file" name="avatar" id="avatar" className="hidden" onChange={handleAvatar} />
                        {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mt-4" />}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:border-transparent"
                            value={user.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white" htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:border-transparent"
                            value={user.username}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white " htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:border-transparent"
                            value={user.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>
                    {!buyer && (
                        <div className="flex flex-col">
                            <label className="text-gray-700 dark:text-white" htmlFor="sellerCategory">Enter your selling Categories</label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="sellerCategory"
                                    id="sellerCategory"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:border-transparent"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="ml-2 py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:ring-opacity-50"
                                    onClick={handleAddCategory}
                                    disabled={loading}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {user.sellerCategory.map((category, index) => (
                                    <div key={index} className="flex items-center bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                                        <span>{category}</span>
                                        <button
                                            type="button"
                                            className="ml-2 text-red-600"
                                            onClick={() => handleRemoveCategory(category)}
                                            disabled={loading}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white focus:ring-opacity-50 mt-4"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign Up"}
                    </button>
                </form>
            </div>
            <div className="flex items-center justify-center mt-4 bg-white dark:bg-gray-950">
                <p className="text-gray-700 dark:text-white">Already have an account?</p>
                <Link to="/login" className="text-indigo-600 dark:text-indigo-400 ml-1 hover:underline">
                    Log In
                </Link>
            </div>
        </div>
    );
}

export default Signup;