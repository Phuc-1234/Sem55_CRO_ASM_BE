/**
 * Category Service
 * Handles business logic for category operations
 */

const Category = require("../models/Category");

/**
 * Get all categories organized in a tree structure
 * @returns {Array} - Nested category tree with subcategories
 */
const getCategories = async () => {
    // Step 1: Fetch All
    const allCategories = await Category.find().lean();

    // Step 2: The "Tree" Builder
    const categoryTree = [];

    // Pass 1: Find all main categories (where parent is null)
    allCategories.forEach((cat) => {
        if (cat.parent === null) {
            categoryTree.push({
                _id: cat._id,
                name: cat.name,
                parent: cat.parent,
                subcategories: [],
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
            });
        }
    });

    // Pass 2: Find all subcategories and attach to their parent
    allCategories.forEach((cat) => {
        if (cat.parent !== null) {
            // Find the parent category in our tree
            const parentCategory = categoryTree.find(
                (mainCat) => mainCat._id.toString() === cat.parent.toString(),
            );

            // If parent found, add this subcategory to its subcategories array
            if (parentCategory) {
                parentCategory.subcategories.push({
                    _id: cat._id,
                    name: cat.name,
                    parent: cat.parent,
                    createdAt: cat.createdAt,
                    updatedAt: cat.updatedAt,
                });
            }
        }
    });

    // Step 3: Return the beautifully structured tree
    return categoryTree;
};

module.exports = {
    getCategories,
};
