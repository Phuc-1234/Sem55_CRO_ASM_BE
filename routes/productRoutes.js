/**
 * Product Routes
 * Define all product-related endpoints
 */

const express = require("express");
const {
    getAllProducts,
    getProductById,
} = require("../controllers/productController");

const router = express.Router();

// GET /api/v1/products
// Query params: limit, page, category, search
router.get("/", getAllProducts);

// GET /api/v1/products/:id
// Get product detail by ID
router.get("/:id", getProductById);

module.exports = router;
