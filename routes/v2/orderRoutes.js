const express = require("express");
const router = express.Router();
const { protect } = require("../../middlewares/authMiddleware");
const {
    getCart,
    updateCartItem,
    updateCheckoutInfo,
    finalizeOrder,
} = require("../../controllers/v2/orderController");

// All cart routes are protected
router.use(protect);

//
router.get("/cart", getCart);

//
router.put("/cart/items", updateCartItem);

// PATCH for partial updates to the checkout details
router.patch("/cart/checkout-details", updateCheckoutInfo);

// POST to transition status from 'cart' to 'ordered'
router.post("/cart/finalize", finalizeOrder);

module.exports = router;
