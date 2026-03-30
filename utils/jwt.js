/**
 * JWT token generation and validation utilities
 */

const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, role) => {
    return jwt.sign(
        { ID: userId, role },
        process.env.JWT_SECRET || "secret_key_access",
        { expiresIn: "1h" },
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        { ID: userId },
        process.env.JWT_REFRESH_SECRET || "secret_key_refresh",
        { expiresIn: "7d" },
    );
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || "secret_key_access");
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(
            token,
            process.env.JWT_REFRESH_SECRET || "secret_key_refresh",
        );
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
