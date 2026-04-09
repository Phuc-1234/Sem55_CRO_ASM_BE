const orderService = require('../../services/v2/orderService');

const getCart = async (req, res) => {
    try {
        const cart = await orderService.fetchUserCart(req.user.id);
        if (!cart) {
            return res.status(404).json({ success: false, message: "No active cart found" });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, selectedColor, quantity } = req.body;
        const updatedCart = await orderService.processCartUpdate(req.user.id, {
            productId,
            selectedColor,
            quantity
        });

        res.status(200).json({
            success: true,
            message: "Cart updated",
            data: updatedCart
        });
    } catch (error) {
        const statusCode = error.status || 500;
        res.status(statusCode).json({ success: false, message: error.message });
    }
};
const updateCheckoutInfo = async (req, res) => {
    try {
        const updatedCart = await orderService.editCheckoutDetails(req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Checkout details updated",
            data: updatedCart
        });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};

const finalizeOrder = async (req, res) => {
    try {
        const finalizedOrder = await orderService.completePurchase(req.user.id);
        res.status(200).json({
            success: true,
            message: "Order placed successfully",
            data: finalizedOrder
        });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message });
    }
};
module.exports = { getCart, updateCartItem, updateCheckoutInfo, finalizeOrder };