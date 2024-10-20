import React, { useState } from 'react';
import api from '../utils/axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const history = useHistory();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const response = await api.post('/auth/register', { username, password });
            toast.success(response.data.message);
            history.push('/login');
        } catch (error) {
            toast.error(error.response.data.error || "Registration failed!");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
