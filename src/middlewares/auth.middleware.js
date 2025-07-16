const jwtService = require('../services/jwt.service');

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
    try {
        const token = auth.split(' ')[1];
        const decoded = jwtService.verify(token);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}; 