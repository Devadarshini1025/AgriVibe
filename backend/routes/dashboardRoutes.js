const express = require("express");

const {
    countUsers,
    getProducts,
    getOrders
} = require("../dataStore");

const router = express.Router();

/*
=========================================================
HELPERS
=========================================================
*/

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function round(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/*
=========================================================
GET IMPACT DASHBOARD
GET /api/dashboard
=========================================================
*/

router.get("/", async (req, res) => {
    try {
        const [
            totalFarmers,
            totalBuyers,
            products,
            orders
        ] = await Promise.all([
            countUsers("farmer"),
            countUsers("buyer"),
            getProducts({}),
            getOrders({})
        ]);

        /*
        -------------------------------------------------
        BASIC COUNTS
        -------------------------------------------------
        */

        const totalCrops = products.length;
        const totalOrders = orders.length;

        const availableProduce = products.reduce(
            (total, product) =>
                total + toNumber(product.quantity),
            0
        );

        /*
        -------------------------------------------------
        ORDER ANALYTICS
        -------------------------------------------------
        */

        const totalQuantitySold = orders.reduce(
            (total, order) =>
                total + toNumber(order.quantity),
            0
        );

        const marketplaceValue = orders.reduce(
            (total, order) =>
                total + toNumber(order.totalPrice),
            0
        );

        /*
        -------------------------------------------------
        FARMER BENEFIT
        -------------------------------------------------
        */

        const farmerBenefitValues = products
            .map((product) => toNumber(product.farmerBenefit))
            .filter((value) => value > 0);

        const averageFarmerBenefit =
            farmerBenefitValues.length > 0
                ? farmerBenefitValues.reduce(
                      (sum, value) => sum + value,
                      0
                  ) / farmerBenefitValues.length
                : 0;

        /*
        -------------------------------------------------
        CONSUMER SAVING
        -------------------------------------------------
        */

        const consumerSavingValues = products
            .map((product) => toNumber(product.consumerSaving))
            .filter((value) => value > 0);

        const averageConsumerSaving =
            consumerSavingValues.length > 0
                ? consumerSavingValues.reduce(
                      (sum, value) => sum + value,
                      0
                  ) / consumerSavingValues.length
                : 0;

        /*
        -------------------------------------------------
        PRICE STATUS
        -------------------------------------------------
        */

        const fairPriceProducts = products.filter(
            (product) =>
                product.priceStatus === "Fair"
        ).length;

        const belowReferenceProducts = products.filter(
            (product) =>
                product.priceStatus === "Below Reference"
        ).length;

        const aboveReferenceProducts = products.filter(
            (product) =>
                product.priceStatus === "Above Reference"
        ).length;

        const fairPriceRate =
            totalCrops > 0
                ? (fairPriceProducts / totalCrops) * 100
                : 0;

        /*
        -------------------------------------------------
        ORDER STATUS
        -------------------------------------------------
        */

        const pendingOrders = orders.filter(
            (order) =>
                order.status === "Pending"
        ).length;

        const acceptedOrders = orders.filter(
            (order) =>
                order.status === "Accepted"
        ).length;

        const rejectedOrders = orders.filter(
            (order) =>
                order.status === "Rejected"
        ).length;

        /*
        -------------------------------------------------
        CROP ANALYTICS
        -------------------------------------------------
        */

        const cropMap = {};

        products.forEach((product) => {
            const cropName =
                product.cropName || "Unknown";

            if (!cropMap[cropName]) {
                cropMap[cropName] = {
                    cropName,
                    listings: 0,
                    availableQuantity: 0,
                    referencePrice: 0,
                    averagePrice: 0
                };
            }

            cropMap[cropName].listings += 1;

            cropMap[cropName].availableQuantity +=
                toNumber(product.quantity);

            cropMap[cropName].referencePrice +=
                toNumber(product.referencePrice);

            cropMap[cropName].averagePrice +=
                toNumber(product.pricePerKg);
        });

        const cropAnalytics = Object.values(cropMap)
            .map((crop) => ({
                cropName: crop.cropName,
                listings: crop.listings,
                availableQuantity:
                    round(crop.availableQuantity),
                referencePrice:
                    round(
                        crop.referencePrice /
                            crop.listings
                    ),
                averagePrice:
                    round(
                        crop.averagePrice /
                            crop.listings
                    )
            }))
            .sort(
                (a, b) =>
                    b.availableQuantity -
                    a.availableQuantity
            );

        /*
        -------------------------------------------------
        MONTHLY ORDER ANALYTICS
        -------------------------------------------------
        */

        const monthlyMap = {};

        orders.forEach((order) => {
            const date = new Date(
                order.createdAt
            );

            if (Number.isNaN(date.getTime())) {
                return;
            }

            const monthKey =
                date.toLocaleString("en-US", {
                    month: "short",
                    year: "numeric"
                });

            if (!monthlyMap[monthKey]) {
                monthlyMap[monthKey] = {
                    month: monthKey,
                    orders: 0,
                    quantity: 0,
                    value: 0
                };
            }

            monthlyMap[monthKey].orders += 1;

            monthlyMap[monthKey].quantity +=
                toNumber(order.quantity);

            monthlyMap[monthKey].value +=
                toNumber(order.totalPrice);
        });

        const monthlyAnalytics =
            Object.values(monthlyMap)
                .sort(
                    (a, b) =>
                        new Date(
                            `1 ${a.month}`
                        ) -
                        new Date(
                            `1 ${b.month}`
                        )
                )
                .map((item) => ({
                    ...item,
                    quantity:
                        round(item.quantity),
                    value:
                        round(item.value)
                }));

        /*
        -------------------------------------------------
        TOP CROPS BY ORDERS
        -------------------------------------------------
        */

        const orderCropMap = {};

        orders.forEach((order) => {
            const cropName =
                order.cropName || "Unknown";

            if (!orderCropMap[cropName]) {
                orderCropMap[cropName] = {
                    cropName,
                    orders: 0,
                    quantity: 0,
                    value: 0
                };
            }

            orderCropMap[cropName].orders += 1;

            orderCropMap[cropName].quantity +=
                toNumber(order.quantity);

            orderCropMap[cropName].value +=
                toNumber(order.totalPrice);
        });

        const topCrops = Object.values(
            orderCropMap
        )
            .sort(
                (a, b) =>
                    b.quantity -
                    a.quantity
            )
            .slice(0, 8)
            .map((crop) => ({
                cropName: crop.cropName,
                orders: crop.orders,
                quantity:
                    round(crop.quantity),
                value:
                    round(crop.value)
            }));

        /*
        -------------------------------------------------
        RESPONSE
        -------------------------------------------------
        */

        res.json({
            success: true,

            summary: {
                totalFarmers,
                totalBuyers,
                totalCrops,
                availableProduce:
                    round(availableProduce),

                totalOrders,

                totalQuantitySold:
                    round(totalQuantitySold),

                marketplaceValue:
                    round(marketplaceValue),

                averageFarmerBenefit:
                    round(averageFarmerBenefit),

                averageConsumerSaving:
                    round(averageConsumerSaving),

                fairPriceRate:
                    round(fairPriceRate),

                fairPriceProducts,
                belowReferenceProducts,
                aboveReferenceProducts,

                pendingOrders,
                acceptedOrders,
                rejectedOrders
            },

            cropAnalytics,

            topCrops,

            monthlyAnalytics,

            generatedAt:
                new Date().toISOString()
        });

    } catch (error) {
        console.error(
            "Impact Dashboard Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to load impact dashboard data"
        });
    }
});

module.exports = router;