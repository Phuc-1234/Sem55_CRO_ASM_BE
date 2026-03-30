/**
 * Product Controller
 * Handles HTTP requests for product endpoints
 */

const { getProducts, getProductDetail } = require("../services/productService");

/**
 * GET /api/v1/products
 * Get products with optional filtering by category, search, pagination
 * Query params: limit, page, category, search
 */
const getAllProducts = async (req, res) => {
    try {
        // Call service to handle all business logic
        const result = await getProducts(req.query);

        // Return 200 OK with products and pagination metadata
        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: {
                totalProducts: result.totalProducts,
                currentPage: result.currentPage,
                limit: result.limit,
                totalPages: result.totalPages,
                products: result.products,
            },
        });
    } catch (error) {
        // Handle validation errors (bad category ID format)
        if (error.status === 400) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        // Handle unexpected errors
        console.error("Get products error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching products",
        });
    }
};

/**
 * GET /api/v1/products/:id
 * Get detailed product information by ID
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate if ID is valid MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID format",
            });
        }

        // Call service to fetch product detail
        const product = await getProductDetail(id);

        // Return 200 OK with product details
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        // Handle 404 Not Found
        if (error.status === 404) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        // Handle unexpected errors
        console.error("Get product detail error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching product details",
        });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
};
