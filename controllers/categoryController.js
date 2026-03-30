/**
 * Category Controller
 * Handles HTTP requests for category endpoints
 */

const { getCategories } = require("../services/categoryService");

/**
 * GET /api/v1/categories
 * Get all categories organized in a tree structure
 */
const getAllCategories = async (req, res) => {
    try {
        // Call service to fetch and organize categories
        const categoryTree = await getCategories();

        // Return 200 OK with category tree
        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categoryTree,
        });
    } catch (error) {
        // Handle unexpected errors
        console.error("Get categories error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while fetching categories",
        });
    }
};

module.exports = {
    getAllCategories,
};
