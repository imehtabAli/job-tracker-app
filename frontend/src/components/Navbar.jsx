import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
                JobTracker
            </div>
            <div className="navbar-right">
                {token ? (
                    <>
                        <span className="navbar-user" onClick={() => navigate("/profile")}>
                            Hi, {user?.firstName}!
                        </span>
                        <button className="btn-nav" onClick={() => navigate("/profile")}>Profile</button>
                        <button className="btn-logout" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <button className="btn-nav" onClick={() => navigate("/login")}>Login</button>
                        <button className="btn-nav" onClick={() => navigate("/register")}>Register</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;