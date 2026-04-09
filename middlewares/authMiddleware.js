const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        // 2. Verify token
        // Make sure you have JWT_ACCESS_SECRET in your .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user data to the request object
        // Based on your generateAccessToken(user._id, user.role)
        req.user = {
            id: decoded.ID,
            role: decoded.role
        };

        console.log(`Authenticated user ID: ${req.user.id}, Role: ${req.user.role}`);

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed or expired",
        });
    }
};

// Optional: Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied: Admins only"
        });
    }
};

module.exports = { protect, adminOnly };