/**
 * Authentication Routes
 * Define all auth-related endpoints
 */

const express = require("express");
const { register, login } = require("../controllers/authController");
const { refreshToken } = require("../controllers/refreshController");

const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", register);

// POST /api/v1/auth/login
router.post("/login", login);

router.post('/refresh', refreshToken);

module.exports = router;
