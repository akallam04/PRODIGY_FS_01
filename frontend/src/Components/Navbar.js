import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">🔒 SecureAuth</Link>
            <ul className="navbar-links">
                {user ? (
                    <>
                        <li><span className="navbar-greeting">Hi, {user.name.split(' ')[0]}</span></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                        <li><button className="btn-logout" onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Sign In</Link></li>
                        <li><Link to="/register">Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
