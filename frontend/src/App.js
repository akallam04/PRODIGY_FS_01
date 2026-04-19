import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './Components/Navbar';
import PrivateRoute from './Components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';

const App = () => (
    <BrowserRouter>
        <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={<PrivateRoute><Dashboard /></PrivateRoute>}
                />
                <Route
                    path="/admin"
                    element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>}
                />
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AuthProvider>
    </BrowserRouter>
);

export default App;
