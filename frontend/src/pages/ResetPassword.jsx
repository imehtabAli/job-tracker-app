import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (formData.newPassword !== formData.confirmNewPassword) {
            return toast.error("Passwords do not match");
        }

        if (formData.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        setLoading(true);
        const toastId = toast.loading("Resetting password...");
        try {
            const response = await api.post(`/auth/reset-password/${token}`, formData);
            setSuccess(response.data.message);
            toast.success("Password reset successfully!", { id: toastId });
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid or expired link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">Enter your new password below</p>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success} Redirecting to login...</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">New Password</label>
                        <input
                            className="auth-input"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            placeholder="Enter new password"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Confirm New Password</label>
                        <input
                            className="auth-input"
                            name="confirmNewPassword"
                            type="password"
                            value={formData.confirmNewPassword}
                            placeholder="Confirm new password"
                            onChange={handleChange}
                        />
                    </div>
                    <button className="auth-btn" type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;