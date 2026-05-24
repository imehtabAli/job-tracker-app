import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Sending reset link...");
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            const response = await api.post("/auth/forgot-password", { email });
            setSuccess(response.data.message);
            toast.success("Reset link sent! Check your email", { id: toastId });
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
            toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Forgot Password</h2>
                <p className="auth-subtitle">Enter your email and we'll send you a reset link</p>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/login")}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;