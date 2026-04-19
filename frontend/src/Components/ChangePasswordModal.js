import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from './Modal';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword.length < 6) return toast.error('New password must be at least 6 characters.');
        if (form.newPassword !== form.confirmNewPassword) return toast.error('New passwords do not match.');

        setLoading(true);
        try {
            await axios.put('/api/auth/password', {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
            });
            toast.success('Password changed successfully!');
            setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Current password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        placeholder="Current password"
                        value={form.currentPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New password</label>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New password (min. 6)"
                        value={form.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Confirm new password</label>
                    <input
                        type="password"
                        name="confirmNewPassword"
                        placeholder="Repeat new password"
                        value={form.confirmNewPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ width: 'auto' }} disabled={loading}>
                        {loading ? <><span className="spinner" /> Updating...</> : 'Update Password'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ChangePasswordModal;
