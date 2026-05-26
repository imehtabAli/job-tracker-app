import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Logging in...");
        try {
            const response = await api.post("/auth/login", formData);
            login(response.data.token);
            toast.success("Welcome back!", { id: toastId });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid email or password");
             toast.error(err.response?.data?.message || "Invalid email or password", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>
                {error && <p className="error-msg">{error}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input className="auth-input" name="email" placeholder="Email" required onChange={handleChange} />
                    <input className="auth-input" name="password" type="password" placeholder="Password" required onChange={handleChange} />
                    <p className="auth-redirect">
                        <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
                    </p>
                    <button className="auth-btn" type="submit">Login</button>
                </form>
                <p className="auth-redirect">Don't have an account? <span onClick={() => navigate("/register")}>Register</span></p>
            </div>
        </div>
    );
};

export default Login;