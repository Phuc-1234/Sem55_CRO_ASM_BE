/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

const { validateRegister, validateLogin } = require("../utils/validation");
const { registerUser, loginUser } = require("../services/authService");

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
const register = async (req, res) => {
    try {
        // Step 1: Validation
        const validation = validateRegister(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
        }

        // Step 2-6: Register user (duplication check, creation, token generation, etc.)
        const result = await registerUser(req.body);

        // Return 201 Created
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        // Handle specific errors from service
        if (error.status === 400) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        // Handle unexpected errors
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during registration",
        });
    }
};

/**
 * POST /api/v1/auth/login
 * Login user with email or phone + password
 */
const login = async (req, res) => {
    try {
        // Step 1: Validation
        const validation = validateLogin(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
        }

        // Step 2-8: Login user (lookup, verification, token generation, etc.)
        const result = await loginUser(req.body);

        // Return 200 OK
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        // Handle 401 Unauthorized (invalid credentials or wrong auth method)
        if (error.status === 401) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }

        // Handle 400 Bad Request (social login required, etc.)
        if (error.status === 400) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        // Handle unexpected errors
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during login",
        });
    }
};

module.exports = {
    register,
    login,
};
