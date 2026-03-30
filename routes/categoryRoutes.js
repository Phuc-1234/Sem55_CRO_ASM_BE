/**
 * Category Routes
 * Define all category-related endpoints
 */

const express = require("express");
const { getAllCategories } = require("../controllers/categoryController");

const router = express.Router();

// GET /api/v1/categories
router.get("/", getAllCategories);

module.exports = router;
