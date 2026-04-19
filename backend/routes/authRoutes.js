const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

const sendUser = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
    });
};

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

        const user = await User.create({ name, email, password, role });
        sendUser(user, 201, res);
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Please provide email and password' });

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password)))
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        sendUser(user, 200, res);
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json({ success: true, user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, createdAt: req.user.createdAt } });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res, next) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) return res.status(400).json({ success: false, message: 'Name and email are required' });
        if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });

        const conflict = await User.findOne({ email, _id: { $ne: req.user._id } });
        if (conflict) return res.status(400).json({ success: false, message: 'Email already in use by another account' });

        const user = await User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true });
        sendUser(user, 200, res);
    } catch (err) {
        next(err);
    }
});

// PUT /api/auth/password
router.put('/password', protect, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both current and new password are required' });
        if (newPassword.length < 6) return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });

        const user = await User.findById(req.user._id).select('+password');
        if (!(await user.matchPassword(currentPassword))) return res.status(401).json({ success: false, message: 'Current password is incorrect' });

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
