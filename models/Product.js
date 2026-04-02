const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        // Renamed to mainImage
        // ORPHAN PROBLEM, but not a critical prob so do later
        mainImage: {
            url: { type: String, required: true },
            public_id: { type: String, required: true }, 
        },
        // Added array for other images
        otherImages: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
            }
        ],
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                required: true,
            },
        ],
        importDate: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true },
);

// --- CUSTOM VALIDATION: Enforce 1 or 2 categories only ---
productSchema.path("categories").validate(function (value) {
    return value.length >= 1 && value.length <= 2;
}, "A product must have exactly 1 or 2 categories.");

productSchema.path("otherImages").validate(function (value) {
    return value.length <= 5; // Limits to 5 extra images
}, "You can only upload a maximum of 5 additional images.");

module.exports = mongoose.model("Product", productSchema);