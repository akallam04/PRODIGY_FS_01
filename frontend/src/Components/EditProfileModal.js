import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) setForm({ name: user.name, email: user.email });
    }, [user, isOpen]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.put('/api/auth/profile', form);
            updateUser(data.user);
            toast.success('Profile updated successfully!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
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
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                        {loading ? <><span className="spinner" /> Saving...</> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditProfileModal;
