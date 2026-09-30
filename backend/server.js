const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const advisoryRoutes = require("./routes/advisoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

/*
=========================================================
CORS
=========================================================
*/

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://agrivibe-eight.vercel.app"
        ],
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);


/*
=========================================================
MIDDLEWARE
=========================================================
*/

app.use(express.json());


/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AgriVibe Backend is running",
        environment: process.env.NODE_ENV || "production"
    });
});


/*
=========================================================
API ROUTES
=========================================================
*/

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.use(
    "/api/advisory",
    advisoryRoutes
);

app.use(
    "/api/payments",
    paymentRoutes
);


/*
=========================================================
404 API HANDLER
=========================================================
*/

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: `API route not found: ${req.method} ${req.originalUrl}`
    });
});


/*
=========================================================
GENERAL ERROR HANDLER
=========================================================
*/

app.use((error, req, res, next) => {
    console.error("Server Error:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});


/*
=========================================================
MONGODB CONNECTION
=========================================================
*/

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {

        console.log("MongoDB Connected");

        app.listen(PORT, () => {

            console.log(
                `Server Running on port ${PORT}`
            );

            console.log(
                "AgriVibe Payment System: Demo Mode"
            );

            console.log(
                "AgriVibe API: Production Ready"
            );
        });

    })
    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error
        );

        process.exit(1);
    });