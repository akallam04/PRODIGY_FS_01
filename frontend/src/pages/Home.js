import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="page">
            <div className="home-hero">
                <h1>Secure User<br />Authentication</h1>
                <p>
                    A production-grade MERN authentication system with JWT tokens,
                    bcrypt password hashing, role-based access control, and protected routes.
                </p>
                <div className="home-cta">
                    {user ? (
                        <Link to="/dashboard" className="btn btn-white btn-hero">Go to Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/register" className="btn btn-white btn-hero">Get Started</Link>
                            <Link to="/login" className="btn btn-ghost btn-hero">Sign In</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
