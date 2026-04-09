const mongoose = require('mongoose');

const orderV2Schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming your existing User model name
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductV2',
            required: true
        },
        selectedColor: {
            type: String, // Stores the hex code or color name chosen
            required: true 
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtTime: {
            type: Number,
            required: true // Captures the price at the moment of purchase
        }
    }],
    payment: {
        method: { type: String, required: true },
        info: { type: mongoose.Schema.Types.Mixed } // Flexible for card digits, transaction IDs, etc.
    },
    shipping: {
        method: { type: String, required: true },
        imgURL: { type: String },
        fee: { type: Number, default: 5 }
    },
    recipientInfo: {
        fullName: { type: String, required: true },
        address: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ['cart', 'ordered', 'processing', 'delivered', 'cancelled'],
        default: 'cart',
        lowercase: true
    },
    // total item price at the time of order, calculated as sum of (priceAtTime * quantity) for all items
    subtotal: {
        type: Number,
        default: 0
    },
    // total order price including shipping, calculated as subtotal + shipping.fee
    total: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

// Enforce "1 user - 1 cart" logic at the database level
// This prevents a user from having two documents with status 'cart'
orderV2Schema.index(
    { user: 1, status: 1 }, 
    { unique: true, partialFilterExpression: { status: 'cart' } }
);

module.exports = mongoose.model('OrderV2', orderV2Schema);