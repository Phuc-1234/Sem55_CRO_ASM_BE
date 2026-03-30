/**
 * Authentication Service
 * Handles business logic for authentication operations
 */

const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} - User details and tokens
 */
const registerUser = async (userData) => {
    const { fullName, email, phone, password, address } = userData;

    // Check if email already exists (if provided)
    if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw {
                status: 400,
                message: "Email already in use",
            };
        }
    }

    // Check if phone already exists (if provided)
    if (phone) {
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            throw {
                status: 400,
                message: "Phone number already in use",
            };
        }
    }

    // Create new user document
    const user = new User({
        fullName,
        email,
        phone,
        password,
        address,
        authMethod: "local",
        role: "customer",
    });

    // Save to database (password hashing happens in pre('save') hook)
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Return user details and tokens (excluding sensitive data)
    return {
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email || null,
            phone: user.phone || null,
            role: user.role,
            address: user.address || null,
        },
        accessToken,
        refreshToken,
    };
};

module.exports = {
    registerUser,
};
