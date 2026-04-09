const mongoose = require('mongoose');

const categoryV2Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    imgURL: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('CategoryV2', categoryV2Schema);