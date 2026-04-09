const Category = require('../../models/CategoryV2');
const Product = require('../../models/ProductV2');

const fetchAllCategories = async () => {
    return await Category.find().select('name _id imgURL').lean();
};

const fetchAllProducts = async (queryOptions) => {
    const { category, page = 1, limit = 10 } = queryOptions;
    
    // 1. Build Filter
    const filter = {};
    if (category) filter.category = category;

    // 2. Pagination Logic
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 3. Query Execution
    // We only select imgURL, name, and price as per your requirement
    const products = await Product.find(filter)
        .select('name imgURL price _id') 
        .skip(skip)
        .limit(parseInt(limit))
        .lean(); // Use lean() for faster read-only queries

    const totalCount = await Product.countDocuments(filter);

    return {
        products,
        totalCount,
        currentPage: parseInt(page)
    };
};

module.exports = { fetchAllCategories, fetchAllProducts };