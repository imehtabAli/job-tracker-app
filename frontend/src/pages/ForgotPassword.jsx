import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Sending reset link...");
        try {
            await api.post("/auth/forgot-password", { email });
            toast.success("Reset link sent! Check your email", { id: toastId });
            setEmail("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="auth-btn" type="submit">Send Reset Link</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/login")}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;