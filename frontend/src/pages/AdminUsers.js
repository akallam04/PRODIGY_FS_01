import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../Components/ConfirmModal';

const AdminUsers = () => {
    const { user: me } = useAuth();
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [confirmState, setConfirmState] = useState({ open: false, userId: null, userName: '' });

    const fetchData = useCallback(async () => {
        try {
            const [usersRes, statsRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/users/stats'),
            ]);
            setUsers(usersRes.data.users);
            setStats(statsRes.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleRoleToggle = async (u) => {
        const newRole = u.role === 'admin' ? 'user' : 'admin';
        setActionLoading(u._id + '-role');
        try {
            await axios.put(`/api/users/${u._id}/role`, { role: newRole });
            toast.success(`${u.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}.`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Role update failed.');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async () => {
        const { userId, userName } = confirmState;
        setActionLoading(userId + '-delete');
        try {
            await axios.delete(`/api/users/${userId}`);
            toast.success(`${userName} deleted.`);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed.');
        } finally {
            setActionLoading(null);
        }
    };

    const newestName = stats?.newestSignups?.[0]?.name ?? '—';

    return (
        <div className="page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
            <div className="card card-wide">
                <h1>All Users</h1>
                <p className="card-subtitle">Admin panel — user management</p>

                {/* Stats */}
                <div className="stats-grid">
                    {[
                        { label: 'Total Users', value: stats?.totalUsers ?? '—' },
                        { label: 'Admins', value: stats?.adminCount ?? '—' },
                        { label: 'Regular Users', value: stats?.userCount ?? '—' },
                        { label: 'Newest Signup', value: newestName },
                    ].map(({ label, value }) => (
                        <div className="stat-card" key={label}>
                            <div className="stat-label">{label}</div>
                            <div className="stat-value">{value}</div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="loading-center"><div className="spinner-lg" /></div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => {
                                    const isSelf = me?._id === u._id;
                                    const roleLoading = actionLoading === u._id + '-role';
                                    const deleteLoading = actionLoading === u._id + '-delete';
                                    return (
                                        <tr key={u._id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {u.name}
                                                {isSelf && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', color: '#9ca3af' }}>(You)</span>}
                                            </td>
                                            <td>{u.email}</td>
                                            <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                                            <td>{new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td>
                                                {isSelf ? (
                                                    <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>—</span>
                                                ) : (
                                                    <div className="actions-cell">
                                                        <button
                                                            className="btn btn-sm btn-outline"
                                                            onClick={() => handleRoleToggle(u)}
                                                            disabled={!!actionLoading}
                                                        >
                                                            {roleLoading ? <span className="spinner" style={{ borderTopColor: '#6366f1' }} /> : (u.role === 'admin' ? 'Make User' : 'Make Admin')}
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => setConfirmState({ open: true, userId: u._id, userName: u.name })}
                                                            disabled={!!actionLoading}
                                                        >
                                                            {deleteLoading ? <span className="spinner" /> : 'Delete'}
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9ca3af' }}>No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ open: false, userId: null, userName: '' })}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Delete "${confirmState.userName}"? This cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </div>
    );
};

export default AdminUsers;
