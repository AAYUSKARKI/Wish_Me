import axios from "axios";
import toast from "react-hot-toast";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
    email: string;
    username: string;
    password: string;
    role: string;
    sellerCategory: string[];
}

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRequirements = [
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter" },
    { regex: /[a-z]/, message: "Password must contain at least one lowercase letter" },
    { regex: /[0-9]/, message: "Password must contain at least one digit" },
    { regex: /[@$!%*?&]/, message: "Password must contain at least one special character" },
];

const generateDefaultAvatar = (username: string): string => {
    const firstLetter = username.charAt(0).toUpperCase();
    const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color

    // SVG string for the avatar
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="75" fill="${color}" />
            <text x="50%" y="50%" font-size="60" text-anchor="middle" dy=".3em" fill="#fff">${firstLetter}</text>
        </svg>
    `;

    // Encode SVG string as a data URL
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

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
    const [error, setError] = useState<string>("");
    const [avatarError, setAvatarError] = useState<string>("");

    useEffect(() => {
        if (user.username) {
            // Update the default avatar only if the username changes
            setAvatarPreview(avatar ? URL.createObjectURL(avatar) : generateDefaultAvatar(user.username));
        }
    }, [user.username, avatar]);

    const handleSeller = () => {
        setBuyer(false);
        setUser({ ...user, role: "seller" });
    };

    const handleBuyer = () => {
        setBuyer(true);
        setUser({ ...user, role: "buyer" });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
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

    const validatePassword = (password: string): string | null => {
        for (const req of passwordRequirements) {
            if (!req.regex.test(password)) {
                return req.message;
            }
        }
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!emailRegex.test(user.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        const passwordError = validatePassword(user.password);
        if (passwordError) {
            toast.error(passwordError);
            setError(passwordError);
            return;
        }

        if (!user.email || !user.username || !user.password || (!buyer && !user.sellerCategory.length)) {
            toast.error("Please fill all the required fields");
            return;
        }

        try {
            setError("");
            setAvatarError("");
            setLoading(true);
            const formData = new FormData();
            if (avatar) {
                formData.append("avatar", avatar);
            } else {
                // Convert the default avatar to a binary format
                const defaultAvatarData = generateDefaultAvatar(user.username);
                const response = await fetch(defaultAvatarData);
                const blob = await response.blob();
                formData.append("avatar", blob, "default-avatar.svg");
            }
            formData.append("email", user.email);
            formData.append("username", user.username);
            formData.append("password", user.password);
            formData.append("role", user.role);
            if (user.role === "seller") {
                formData.append("sellerCategory", JSON.stringify(user.sellerCategory));
            }

            const res = await axios.post('https://wish-me-65k8.onrender.com/api/v1/users/register', formData);
            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/verify");
            } else {
                toast.error("Failed to register. Please try again.");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dark:bg-gray-900 dark:text-gray-100 min-h-screen flex flex-col items-center justify-center">
            <div className="dark:bg-gray-950 dark:text-gray-100 w-full max-w-md p-8 bg-white rounded-lg shadow-lg relative">
                <div className="dark:bg-gray-950 mb-5 dark:text-gray-100 absolute top-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-4 py-4 bg-white rounded-b-lg shadow-md">
                    <h1
                        onClick={handleSeller}
                        className={`cursor-pointer text-sm md:text-xl font-bold ${!buyer ? "text-green-500" : "text-gray-500"}`}
                    >
                        Sign Up As A Seller
                    </h1>
                    <h1
                        onClick={handleBuyer}
                        className={`cursor-pointer text-sm md:text-xl font-bold ${buyer ? "text-green-500" : "text-gray-500"}`}
                    >
                        Sign Up As A Buyer
                    </h1>
                </div>
                <h1 className="text-xl md:text-3xl md:font-bold text-gray-800 mt-16 mb-6">You are signing up as a {user.role}</h1>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center">
                        <label htmlFor="avatar" className="cursor-pointer flex flex-col items-center">
                            <IoCloudUploadOutline className="text-3xl text-gray-500" />
                            <span className="text-gray-500">Upload Avatar</span>
                        </label>
                        <input type="file" name="avatar" id="avatar" className="hidden" onChange={handleAvatar} />
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mt-4" />
                        ) : (
                            <img src={generateDefaultAvatar(user.username)} alt="Default Avatar Preview" className="w-24 h-24 rounded-full object-cover mt-4" />
                        )}
                        {avatarError && <p className="text-red-500">{avatarError}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white" htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-gray-700 dark:text-white" htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    {user.role === "seller" && (
                        <div className="flex flex-col">
                            <label className="text-gray-700 dark:text-white" htmlFor="categories">Seller Categories</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    name="categoryInput"
                                    id="categoryInput"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    placeholder="Add category"
                                />
                                <button type="button" onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded-md">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.sellerCategory.map((category) => (
                                    <span key={category} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center gap-2">
                                        {category}
                                        <button type="button" onClick={() => handleRemoveCategory(category)} className="text-red-500">x</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-gray-700 dark:text-gray-400 mt-4">
                    Already have an account? <Link to="/login" className="text-green-500">Log in</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
