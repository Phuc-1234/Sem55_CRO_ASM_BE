const OrderV2 = require("../../models/v2/OrderV2");
const ProductV2 = require("../../models/v2/ProductV2");

const fetchUserCart = async (userId) => {
    return await OrderV2.findOne({ user: userId, status: "cart" }).populate(
        "items.productId",
        "name imgURL price",
    );
};

const processCartUpdate = async (userId, itemData) => {
    const { productId, selectedColor, quantity } = itemData;

    // 1. Find the current cart or create a new one
    // We use default values for required shipping/payment fields for a "cart" status
    let cart = await OrderV2.findOne({ user: userId, status: "cart" });

    if (!cart) {
        cart = new OrderV2({
            user: userId,
            status: "cart",
            items: [],
            payment: { method: "pending", info: {} },
            shipping: { method: "pending" },
            recipientInfo: { fullName: "Pending", address: "Pending" },
        });
    }

    // 2. Get product price (Snapshotting priceAtTime)
    const product = await ProductV2.findById(productId);
    if (!product) throw { status: 404, message: "Product not found" };

    // 3. Check if this specific variant (ID + Color) already exists in cart
    const itemIndex = cart.items.findIndex(
        (item) =>
            item.productId.toString() === productId &&
            item.selectedColor === selectedColor,
    );

    if (itemIndex > -1) {
        // SCENARIO: Item exists
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].priceAtTime = product.price;
        }
    } else if (quantity > 0) {
        // SCENARIO: New item
        cart.items.push({
            productId,
            selectedColor,
            quantity,
            priceAtTime: product.price,
        });
    }

    // Calculate subtotal and total
    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.priceAtTime * item.quantity,
        0,
    );
    cart.subtotal = subtotal;
    cart.shipping.fee = cart.shipping.fee || 5; // Default to 5 if not set
    cart.total = subtotal + cart.shipping.fee;

    await cart.save();

    // Return populated cart so Kotlin gets the full object (name, imgURL) for UI sync
    return await OrderV2.findById(cart._id).populate(
        "items.productId",
        "name imgURL price",
    );
};

// Helper to calculate money totals
const calculateTotals = (cart) => {
    const subtotal = cart.items.reduce((acc, item) => {
        return acc + item.priceAtTime * item.quantity;
    }, 0);
    const total = subtotal + (cart.shipping?.fee || 0);
    return { subtotal, total };
};

const editCheckoutDetails = async (userId, updateData) => {
    const cart = await OrderV2.findOne({ user: userId, status: "cart" });
    if (!cart) throw { status: 404, message: "No active cart found" };

    // Update fields from body (payment, shipping, recipientInfo)
    if (updateData.payment) cart.payment = updateData.payment;
    if (updateData.shipping) cart.shipping = updateData.shipping;
    if (updateData.recipientInfo) cart.recipientInfo = updateData.recipientInfo;

    // Recalculate totals because shipping fee might have changed
    const { subtotal, total } = calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    await cart.save();
    return cart;
};

const completePurchase = async (userId) => {
    const cart = await OrderV2.findOne({ user: userId, status: "cart" });

    if (!cart || cart.items.length === 0) {
        throw { status: 400, message: "Cart is empty" };
    }

    // Basic Validation: Ensure checkout info isn't still 'Pending'
    if (
        cart.recipientInfo.address === "Pending" ||
        cart.payment.method === "pending"
    ) {
        throw {
            status: 400,
            message: "Please complete shipping and payment info",
        };
    }

    // Final calculations before locking
    const { subtotal, total } = calculateTotals(cart);
    cart.subtotal = subtotal;
    cart.total = total;

    // The "Finalize" step
    cart.status = "ordered";

    await cart.save();
    return cart;
};

module.exports = {
    fetchUserCart,
    processCartUpdate,
    editCheckoutDetails,
    completePurchase,
};
