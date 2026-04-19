import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from '../Components/EditProfileModal';
import ChangePasswordModal from '../Components/ChangePasswordModal';

const Dashboard = () => {
    const { user } = useAuth();
    const [serverMsg, setServerMsg] = useState('');
    const [msgLoading, setMsgLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [pwOpen, setPwOpen] = useState(false);

    useEffect(() => {
        axios.get('/api/users/dashboard')
            .then(({ data }) => setServerMsg(data.message))
            .catch(() => setServerMsg('Could not reach the server.'))
            .finally(() => setMsgLoading(false));
    }, []);

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        : '—';

    const accountAgeDays = user?.createdAt
        ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400000)
        : null;

    return (
        <div className="page">
            <div className="card card-wide">
                <h1>Dashboard</h1>
                <p className="card-subtitle">Your account at a glance</p>

                {msgLoading ? (
                    <div className="loading-center" style={{ minHeight: 60 }}><div className="spinner-lg" /></div>
                ) : (
                    <div className="dashboard-message">{serverMsg}</div>
                )}

                <div className="dashboard-grid">
                    <div className="info-item">
                        <div className="label">Full Name</div>
                        <div className="value">{user?.name}</div>
                    </div>
                    <div className="info-item">
                        <div className="label">Email</div>
                        <div className="value">{user?.email}</div>
                    </div>
                    <div className="info-item">
                        <div className="label">Role</div>
                        <div className="value">
                            <span className={`badge badge-${user?.role}`}>{user?.role}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="label">Member Since</div>
                        <div className="value">{memberSince}</div>
                    </div>
                    {accountAgeDays !== null && (
                        <div className="info-item">
                            <div className="label">Account Age</div>
                            <div className="value">
                                {accountAgeDays === 0 ? 'Today' : `${accountAgeDays} day${accountAgeDays !== 1 ? 's' : ''}`}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => setEditOpen(true)}>Edit Profile</button>
                    <button className="btn btn-outline" onClick={() => setPwOpen(true)}>Change Password</button>
                </div>
            </div>

            <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
            <ChangePasswordModal isOpen={pwOpen} onClose={() => setPwOpen(false)} />
        </div>
    );
};

export default Dashboard;
