const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                priceAtTime: {
                    type: Number,
                    required: true, // Captured at checkout or add-to-cart
                },
            },
        ],
        paymentMethod: {
            type: String,
            trim: true,
            default: "Tiền mặt",
        },
        shippingMethod: [
            {
                name: String,
                fee: Number,
                soonestArrivalTime: Date,
                latestArrivalTime: Date,
                isSelected: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        recipientInfo: {
            fullName: String,
            email: String,
            address: String,
            phone: String,
        },
        status: {
            type: String,
            enum: ["cart", "ordered", "processing", "delivered", "cancelled"],
            default: "cart",
            lowercase: true,
        },
        statusHistory: [
            {
                status: String,
                updatedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        subtotal: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

// --- INDEXES ---
// Enforce "1 User - 1 Cart": A user can only have ONE document with status "cart"
// If they try to create another 'cart', MongoDB will throw an error.
orderSchema.index(
    { user: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: "cart" } },
);

// --- MIDDLEWARE: Auto-update Status History ---
orderSchema.pre("save", async function () {
    // Only push to history if the status is new or has been changed
    if (this.isModified("status") || this.isNew) {
        this.statusHistory.push({
            status: this.status,
            updatedAt: new Date(),
        });
    }
});

module.exports = mongoose.model("Order", orderSchema);
