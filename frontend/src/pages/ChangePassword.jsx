import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ChangePassword = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        currentPassword: "",
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
            return toast.error("New passwords do not match");
        }

        if (formData.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }

        const toastId = toast.loading("Changing password...");

        try {
            const response = await api.put("/user/change-password", formData);
            setSuccess(response.data.message);
            toast.success("Password changed successfully!", { id: toastId });
            setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
            toast.error(err.response?.data?.message || "Failed to change password", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Change Password</h2>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Current Password</label>
                        <input
                            className="auth-input"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            placeholder="Enter current password"
                            onChange={handleChange}
                        />
                    </div>
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
                    <button className="auth-btn" type="submit">Change Password</button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/profile")}>Back to Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;