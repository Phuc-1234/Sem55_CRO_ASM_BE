const mongoose = require('mongoose');

const productV2Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CategoryV2',
        required: true
    },
    imgURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    availableColors: [{
        type: String, // Storing hex codes as strings
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please provide a valid hex color']
    }],
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductV2', productV2Schema);