/**
 * Product Service
 * Handles business logic for product operations
 */

const Product = require("../models/Product");

/**
 * Get products with filtering, search, and pagination
 * @param {Object} queryParams - Query parameters from request
 * @returns {Object} - Products, pagination info, and total count
 */
const getProducts = async (queryParams) => {
    // Step 1: Extract and Initialize Query Parameters with defaults
    const limit = Math.max(1, parseInt(queryParams.limit) || 10);
    const page = Math.max(1, parseInt(queryParams.page) || 1);
    const category = queryParams.category;
    const search = queryParams.search;

    // Initialize empty database query object
    const dbQuery = {};

    // Step 2: Build the Database Query Filters
    // Case A: If user provided a search string
    if (search && search.trim()) {
        // Use regex for case-insensitive search on product name
        dbQuery.name = { $regex: search.trim(), $options: "i" };
    }

    // Case B: If user provided a category (main or subcategory ID)
    if (category) {
        // Check if category ID is valid MongoDB ObjectId format
        if (!category.match(/^[0-9a-fA-F]{24}$/)) {
            throw {
                status: 400,
                message: "Invalid category ID format",
            };
        }

        // Find products where categories array contains this ID
        dbQuery.categories = { $in: [category] };
    }

    // Step 3: Handle Pagination Math
    const skipValue = (page - 1) * limit;

    // Step 4: Execute Database Operations
    // Operation 1: Get the Total Count (for frontend infinite scroll / pagination info)
    const totalProducts = await Product.countDocuments(dbQuery);

    // Operation 2: Fetch the Granular Product Data
    const products = await Product.find(dbQuery)
        .skip(skipValue)
        .limit(limit)
        // Field Selection: Only return essential lightweight fields
        .select("mainImage name categories price")
        // Category Magic: Populate category data with only name and parent fields
        .populate({
            path: "categories",
            select: "name parent",
        })
        .lean();

    // Step 5: Post-Processing - Clean up Category Structure
    const cleanedProducts = products.map((product) => {
        const categoryMap = {
            mainCategory: null,
            subcategory: null,
        };

        // Loop through categories array (1 or 2 items)
        if (product.categories && Array.isArray(product.categories)) {
            product.categories.forEach((cat) => {
                if (cat.parent === null) {
                    // This is a Main Category
                    categoryMap.mainCategory = cat.name;
                } else {
                    // This is a Subcategory
                    categoryMap.subcategory = cat.name;
                }
            });
        }

        // Return cleaned product with organized category structure
        return {
            _id: product._id,
            name: product.name,
            price: product.price,
            mainImage: product.mainImage,
            mainCategory: categoryMap.mainCategory,
            subcategory: categoryMap.subcategory,
        };
    });

    // Step 6: Return the Response with pagination metadata
    return {
        totalProducts,
        currentPage: page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        products: cleanedProducts,
    };
};

/**
 * Get detailed product information by ID
 * @param {String} productId - Product ID from URL parameter
 * @returns {Object} - Complete product object with populated categories
 */
const getProductDetail = async (productId) => {
    // Step 1: Extract Parameter (already done by Express router)
    // Step 2: Database Lookup - find product by ID
    const product = await Product.findById(productId)
        // Step 4: Populate Categories with name and parent info
        .populate({
            path: "categories",
            select: "name parent",
        });

    // Step 3: Handle Missing Product
    if (!product) {
        throw {
            status: 404,
            message: "Product not found",
        };
    }

    // Step 5: Return the complete product with full details
    return {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        mainImage: product.mainImage,
        otherImages: product.otherImages,
        categories: product.categories,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
};

module.exports = {
    getProducts,
    getProductDetail,
};
