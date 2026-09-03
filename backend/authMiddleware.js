const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    console.log('TOKEN RECEIVED:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('TOKEN DECODED:', decoded);

        req.userId = decoded.userId;

        next();

    } catch (error) {

        console.log('JWT ERROR:', error.message);

        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;