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
            axios.post(`https://wish-me-65k8.onrender.com/api/v1/users/verifyaccount/${token}`)
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
        <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-950 dark:text-white p-4 shadow-2xl">
            {loading ? (
                <p>Loading...</p>
            ) : (

                <>
                <h1>VERIFY YOUR EMAIL</h1>
                <p>We have sent you an email with a link to verify your account.</p>
                <p>Click on the link sent to your email to verify your account</p>
                <p>{message}</p>
                </>
                
            )}
        </div>
    );
}

export default VerifyEmail;
