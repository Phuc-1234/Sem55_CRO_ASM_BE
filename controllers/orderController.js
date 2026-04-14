const orderService = require("../services/orderService");

const getCart = async (req, res) => {
    console.log("Getting cart for user ID:", req.user.id);
    try {
        const cart = await orderService.getFullCart(req.user.id);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No active cart found",
            });
        }

        console.log("Returning cart for user ID:", req.user.id);
        res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateCartItems = async (req, res) => {
    try {
        const cart = await orderService.updateItems(
            req.user.id,
            req.body.items,
        );
        res.status(200).json({
            success: true,
            message: "Cart items updated",
            data: cart,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateCheckoutDetails = async (req, res) => {
    try {
        const cart = await orderService.updateDetails(req.user.id, req.body);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid data format",
        });
    }
};

const finalizeOrder = async (req, res) => {
    try {
        const result = await orderService.finalize(req.user.id);
        res.status(200).json({
            success: true,
            message: "Order placed successfully",
            data: result,
            orderId: result._id,
            newStatus: "ordered",
        });
    } catch (error) {
        console.error("Error finalizing order:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    updateCartItems,
    updateCheckoutDetails,
    finalizeOrder,
};
