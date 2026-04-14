const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

// --- Helper: Calculate Subtotal and Total ---
const calculateTotals = async (cart) => {
    let subtotal = 0;

    // Calculate subtotal from items
    for (const item of cart.items) {
        subtotal += item.priceAtTime * item.quantity;
    }

    // Calculate shipping fee from selected shipping method
    let shippingFee = 0;
    if (cart.shippingMethod && Array.isArray(cart.shippingMethod)) {
        const selected = cart.shippingMethod.find(
            (method) => method.isSelected,
        );
        if (selected) {
            shippingFee = selected.fee || 0;
        }
    }

    const total = subtotal + shippingFee;

    return { subtotal, total };
};

const getFullCart = async (userId) => {
    // 1. Always get a cart (finds existing or creates new)

    let cart = await _getOrCreateCart(userId);

    // 2. Logic: Check if recipientInfo is missing/empty
    const isInfoMissing =
        !cart.recipientInfo ||
        !cart.recipientInfo.address ||
        cart.recipientInfo.address.trim() === "";

    if (isInfoMissing) {
        // Fetch user profile data to fill the gap
        const userProfile = await User.findById(userId);

        if (userProfile) {
            cart.recipientInfo = {
                fullName: userProfile.fullName,
                email: userProfile.email,
                phone: userProfile.phone,
                address: userProfile.address,
            };

            // Note: We don't necessarily call cart.save() here so the DB stays clean
            // until the user actually modifies the cart or proceeds to checkout.
        }
    }

    // 3. Calculate and set totals
    const { subtotal, total } = await calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    return cart;
};

// --- Private Helper ---
const _getOrCreateCart = async (userId) => {
    // Look for existing cart
    let cart = await Order.findOne({ user: userId, status: "cart" }).populate(
        "items.productId",
        "name mainImage price stock",
    );
    console.log("this still runs");
    // If not found, create a fresh one
    if (!cart) {
        cart = await Order.create({
            user: userId,
            items: [],
            status: "cart",
        });
    }

    return cart;
};

const updateItems = async (userId, items) => {
    const cart = await _getOrCreateCart(userId);

    // Optional: Validate stock levels before saving
    // for (const item of items) {
    //     const product = await Product.findById(item.productId);
    //     if (!product || product.stock < item.quantity) {
    //         throw new Error(`Quantity exceeds available stock for ${product?.name || 'item'}`);
    //     }
    // }

    cart.items = items;

    // Calculate and set totals
    const { subtotal, total } = await calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    return await cart.save();
};

const updateDetails = async (userId, details) => {
    const cart = await _getOrCreateCart(userId);

    if (details.recipientInfo) cart.recipientInfo = details.recipientInfo;
    if (details.shippingMethod) cart.shippingMethod = details.shippingMethod;
    if (details.paymentMethod) cart.paymentMethod = details.paymentMethod;

    // Calculate and set totals (important when shipping method changes)
    const { subtotal, total } = await calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    return await cart.save();
};

const finalize = async (userId) => {
    const cart = await Order.findOne({ user: userId, status: "cart" });

    if (!cart || cart.items.length === 0) {
        throw new Error("Cannot finalize an empty cart");
    }

    if (!cart.recipientInfo || !cart.recipientInfo.address) {
        throw new Error("Please provide shipping address before finalizing");
    }

    // 1. Calculate and set totals before finalizing
    const { subtotal, total } = await calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    // 2. Change status (This triggers the pre-save statusHistory hook)
    cart.status = "ordered";
    await cart.save();

    // 3. Create a fresh empty cart for the user for their next session
    // Because the old cart is now "ordered", the unique index is free.
    await Order.create({ user: userId, items: [], status: "cart" });

    return cart;
};

module.exports = {
    getFullCart,
    updateItems,
    updateDetails,
    finalize,
    calculateTotals,
};
