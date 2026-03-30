/**
 * Validation utilities for request validation
 */

const validateRegister = (body) => {
    const errors = [];

    // Check required fields
    if (!body.password) {
        errors.push("Password is required");
    }

    if (!body.email && !body.phone) {
        errors.push("Either email or phone is required");
    }

    if (!body.fullName) {
        errors.push("Full name is required");
    }

    // Validate email format if provided
    if (body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            errors.push("Invalid email format");
        }
    }

    // Validate phone format if provided (basic validation)
    if (body.phone) {
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(body.phone.replace(/\D/g, ""))) {
            errors.push("Invalid phone number format");
        }
    }

    // Validate password strength
    if (body.password && body.password.length < 6) {
        errors.push("Password must be at least 6 characters long");
    }

    // Validate address if provided
    if (body.address && body.address.length > 500) {
        errors.push("Address must not exceed 500 characters");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

const validateLogin = (body) => {
    const errors = [];

    // Check required fields
    if (!body.identifier) {
        errors.push("Email or phone (identifier) is required");
    }

    if (!body.password) {
        errors.push("Password is required");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

module.exports = {
    validateRegister,
    validateLogin,
};
