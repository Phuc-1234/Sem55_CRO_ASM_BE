const express = require("express");
const router = express.Router();
const { getCart, updateCartItems, updateCheckoutDetails, finalizeOrder } = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");


router.use(protect);

// GET /api/v1/orders/cart
router.get("/cart", getCart);

router.patch("/cart/items", updateCartItems);
router.patch("/cart/checkout-details", updateCheckoutDetails);
router.post("/cart/finalize", finalizeOrder);

module.exports = router;