const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/stats  — admin only (must be before /:id routes)
router.get('/stats', protect, admin, async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = totalUsers - adminCount;
        const newestSignups = await User.find()
            .select('name email createdAt')
            .sort({ createdAt: -1 })
            .limit(3);
        res.json({ success: true, totalUsers, adminCount, userCount, newestSignups });
    } catch (err) {
        next(err);
    }
});

// GET /api/users/dashboard  — protected
router.get('/dashboard', protect, (req, res) => {
    res.json({
        success: true,
        message: `Welcome back, ${req.user.name}! Your dashboard is live.`,
        user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role, createdAt: req.user.createdAt },
    });
});

// GET /api/users  — admin only
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, users });
    } catch (err) {
        next(err);
    }
});

// PUT /api/users/:id/role  — admin only
router.put('/:id/role', protect, admin, async (req, res, next) => {
    try {
        if (req.user._id.toString() === req.params.id)
            return res.status(400).json({ success: false, message: 'You cannot change your own role' });

        const { role } = req.body;
        if (!['user', 'admin'].includes(role))
            return res.status(400).json({ success: false, message: 'Role must be "user" or "admin"' });

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
});

// DELETE /api/users/:id  — admin only
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        if (req.user._id.toString() === req.params.id)
            return res.status(400).json({ success: false, message: 'You cannot delete your own account' });

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, message: `User "${user.name}" deleted successfully` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
