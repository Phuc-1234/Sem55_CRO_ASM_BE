const express = require("express");
const router = express.Router();
const {
    getCategories,
    getProducts,
    getProductDetail,
} = require("../../controllers/v2/shopController");

// GET /api/v1/categoriesV2
router.get("/categoriesV2", getCategories);

// GET /api/v1/productsV2
router.get("/productsV2", getProducts);

// GET /api/v1/productsV2/:id - Get product detail by ID
router.get("/productsV2/:id", getProductDetail);

module.exports = router;
