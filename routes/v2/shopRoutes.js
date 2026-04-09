const express = require('express');
const router = express.Router();
const { getCategories, getProducts } = require('../../controllers/v2/shopController');

// GET /api/v1/categoriesV2
router.get('/categoriesV2', getCategories);

// GET /api/v1/productsV2
router.get('/productsV2', getProducts);

module.exports = router;