const User = require('../models/user.model');
const jwtService = require('../services/jwt.service');

exports.register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already exists' });
        const passwordHash = await require('bcryptjs').hash(password, 10);
        const user = await User.create({ email, passwordHash, role });
        const token = jwtService.sign({ id: user._id, role: user.role });
        res.status(201).json({ token });
    } catch (e) {
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        const valid = await user.validatePassword(password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
        const token = jwtService.sign({ id: user._id, role: user.role });
        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
}; 