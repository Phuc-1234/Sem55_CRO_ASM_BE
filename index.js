const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const shopRoutesV2 = require("./routes/v2/shopRoutes");
const orderRoutesV2 = require("./routes/v2/orderRoutes");
const testNotifications = require("./routes/testNotifications");
const orderRoutes = require("./routes/orderRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React Native app to make requests
app.use(express.json()); // Allows Express to parse JSON bodies

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose
    .connect(mongoURI)
    .then(() => console.log("🍃 MongoDB Atlas connected successfully!"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test Route
app.get("/", (req, res) => {
    res.send("API is running smoothly!");
});

// Auth Routes
app.use("/api/v1/auth", authRoutes);

// Product Routes
app.use("/api/v1/products", productRoutes);

// Category Routes
app.use("/api/v1/categories", categoryRoutes);

// Shop Routes V2
app.use("/api/v1", shopRoutesV2);

// Order Routes
app.use("/api/v1/ordersV2", orderRoutesV2);
app.use("/api/v1/orders", orderRoutes);


// Test Notifications Route
app.use("/api/v1", testNotifications);
 



// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
