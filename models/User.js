const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
            required: true,
        },
        // Simplified: Storing just 1 method per account as a string
        authMethod: {
            type: String,
            enum: ["local", "google", "facebook"],
            required: true,
            default: "local",
        },
        // Credentials (Sparse allows us to keep them unique but optional for OAuth users)
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Doesn't return password in standard queries for security
        },
        // OAuth IDs
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        facebookId: {
            type: String,
            unique: true,
            sparse: true,
        },
        // Auth & Roles
        role: {
            type: String,
            enum: ["customer", "admin"],
            default: "customer",
        },
        refreshToken: {
            type: String,
        },
        // Added from your image
        address: {
            type: String,
            trim: true,
        },
        // favorite products
        favoriteProducts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ]
    },
    { timestamps: true },
);


// --- MIDDLEWARE: Hash password before saving ---
userSchema.pre("save", async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        // In async middleware, throwing an error automatically triggers Mongoose's error handling
        throw err; 
    }
});

// --- HELPER METHOD: Compare password for login ---
userSchema.methods.comparePassword = async function (candidatePassword) {
    // remember to .select('+password')
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
