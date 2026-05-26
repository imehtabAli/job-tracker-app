import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmNewPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            return toast.error("Passwords do not match");
        }
        if (formData.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }
        const toastId = toast.loading("Resetting password...");
        try {
            await api.post(`/auth/reset-password/${token}`, formData);
            toast.success("Password reset successfully!", { id: toastId });
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid or expired link", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Reset Password</h2>
                <p className="auth-subtitle">Enter your new password below</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">New Password</label>
                        <input className="auth-input" name="newPassword" type="password" value={formData.newPassword} placeholder="Enter new password" onChange={handleChange} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Confirm New Password</label>
                        <input className="auth-input" name="confirmNewPassword" type="password" value={formData.confirmNewPassword} placeholder="Confirm new password" onChange={handleChange} />
                    </div>
                    <button className="auth-btn" type="submit">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;