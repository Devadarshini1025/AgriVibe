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

app.use(
    cors()
);

app.use(
    express.json()
);


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
MONGODB CONNECTION
=========================================================
*/

mongoose
    .connect(
        process.env.MONGO_URI
    )

    .then(() => {

        console.log(
            "MongoDB Connected"
        );

        app.listen(
            process.env.PORT,
            () => {

                console.log(
                    `Server Running on port ${process.env.PORT}`
                );

                console.log(
                    "AgriVibe Payment System: Demo Mode"
                );
            }
        );

    })

    .catch((error) => {

        console.error(
            "MongoDB Connection Error:",
            error
        );

    });