/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */

const { validateRegister } = require("../utils/validation");
const { registerUser } = require("../services/authService");

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

module.exports = {
    register,
};
