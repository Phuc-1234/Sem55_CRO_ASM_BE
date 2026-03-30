const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true, // Prevents duplicate categories
        },
        // If null, it's a top-tier category.
        // If it has an ID, it's a sub-category.
        parent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Category", categorySchema);
