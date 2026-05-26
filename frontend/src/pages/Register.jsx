import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        const toastId = toast.loading("Creating account...");
        try {
            await api.post("/auth/register", formData);
            toast.success("Account created! Please login", { id: toastId });
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong", { id: toastId });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
                {error && <p className="error-msg">{error}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input className="auth-input" name="firstName" placeholder="First Name" required onChange={handleChange} />
                    <input className="auth-input" name="lastName" placeholder="Last Name" required onChange={handleChange} />
                    <input className="auth-input" name="userName" placeholder="Username" required onChange={handleChange} />
                    <input className="auth-input" name="email" placeholder="Email" required onChange={handleChange} />
                    <input className="auth-input" name="password" type="password" placeholder="Password" required onChange={handleChange} />
                    <input className="auth-input" name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
                    <button className="auth-btn" type="submit">Register</button>
                </form>
                <p className="auth-redirect">Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
            </div>
        </div>
    );
};

export default Register;