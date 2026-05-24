import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Profile = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        phoneNumber: "",
        dateOfBirth: "",
        country: "",
        gender: "",
        profilePicture: "",
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await api.get("/user/me");
            const u = response.data;
            setFormData({
                firstName: u.firstName || "",
                lastName: u.lastName || "",
                userName: u.userName || "",
                phoneNumber: u.phoneNumber || "",
                dateOfBirth: u.dateOfBirth?.slice(0, 10) || "",
                country: u.country || "",
                gender: u.gender || "",
                profilePicture: u.profilePicture || "",
            });
        } catch (err) {
            setError("Failed to fetch profile");
            toast.error("Failed to fetch profile");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("Saving changes...");
        setError(null);
        setSuccess(null);
        try {
            const response = await api.put("/user/update", formData);
            setUser(response.data);
            setSuccess("Profile updated successfully!");
            toast.success("Profile updated successfully!", { id: toastId });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile");
            toast.error(err.response?.data?.message || "Failed to update profile", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {formData.profilePicture ? (
                            <img src={formData.profilePicture} alt="Profile" />
                        ) : (
                            <div className="avatar-placeholder">
                                {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <h2 className="auth-title">{formData.firstName} {formData.lastName}</h2>
                    <p className="profile-username">@{formData.userName}</p>
                </div>

                {error && <p className="error-msg">{error}</p>}
                {success && <p className="success-msg">{success}</p>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input className="auth-input" name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} />
                        <input className="auth-input" name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleChange} />
                    </div>
                    <input className="auth-input" name="userName" value={formData.userName} placeholder="Username" onChange={handleChange} />
                    <input className="auth-input" name="phoneNumber" value={formData.phoneNumber} placeholder="Phone Number" onChange={handleChange} />
                    <input className="auth-input" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                    <input className="auth-input" name="country" value={formData.country} placeholder="Country" onChange={handleChange} />
                    <select className="auth-input" name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                    <input className="auth-input" name="profilePicture" value={formData.profilePicture} placeholder="Profile Picture URL" onChange={handleChange} />
                    <button className="auth-btn" type="submit">Save Changes</button>
                    <button type="button" className="btn-change-password" onClick={() => navigate("/change-password")}>
                        Change Password
                    </button>
                    <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;