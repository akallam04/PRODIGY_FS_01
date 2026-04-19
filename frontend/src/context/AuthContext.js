import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('authUser');
        const token = localStorage.getItem('authToken');
        if (stored && token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.get('/api/auth/me')
                .then(({ data }) => {
                    const fresh = data.user;
                    localStorage.setItem('authUser', JSON.stringify(fresh));
                    setUser(fresh);
                })
                .catch((err) => {
                    if (err.response?.status === 401) {
                        localStorage.removeItem('authUser');
                        localStorage.removeItem('authToken');
                        delete axios.defaults.headers.common['Authorization'];
                    } else {
                        setUser(JSON.parse(stored));
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const saveSession = (userData, token) => {
        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authToken', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
    };

    const updateUser = (newUserData) => {
        const merged = { ...user, ...newUserData };
        localStorage.setItem('authUser', JSON.stringify(merged));
        setUser(merged);
    };

    const login = async (email, password) => {
        const { data } = await axios.post('/api/auth/login', { email, password });
        saveSession(data.user, data.token);
        return data;
    };

    const register = async (userData) => {
        const { data } = await axios.post('/api/auth/register', userData);
        saveSession(data.user, data.token);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('authUser');
        localStorage.removeItem('authToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
