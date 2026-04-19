import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6) {
            return toast.error('Password must be at least 6 characters.');
        }
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match.');
        }
        setLoading(true);
        try {
            const { name, email, password, role } = form;
            await register({ name, email, password, role });
            toast.success('Account created! Welcome aboard.');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card">
                <h1>Create account</h1>
                <p className="card-subtitle">Join SecureAuth today</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g. Jane Doe"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password <span style={{ color: '#9ca3af', fontWeight: 400 }}>(min. 6 chars)</span></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
                    </button>
                </form>

                <p className="form-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
