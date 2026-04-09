const shopService = require('../../services/v2/shopService');

const getCategories = async (req, res) => {
    try {
        const categories = await shopService.fetchAllCategories();
        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        // Extract query params for filtering and pagination
        const { category, page, limit } = req.query;
        
        const result = await shopService.fetchAllProducts({ category, page, limit });

        res.status(200).json({
            success: true,
            count: result.totalCount,
            page: result.currentPage,
            data: result.products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getCategories, getProducts };