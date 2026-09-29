const express = require("express");

const {
    getProducts,
    getOrders
} = require("../dataStore");

const router = express.Router();


/*
 * ============================================================
 * CROP ADVISORY
 * ============================================================
 *
 * Existing AgriVibe crop advisory system.
 *
 * POST
 * /api/advisory
 *
 * The backend returns recommendation codes.
 * The frontend can translate those codes into
 * the selected Indian language.
 *
 * ============================================================
 */

router.post("/", async (req, res) => {
    try {
        const {
            cropName,
            soilType,
            weather,
            temperature,
            humidity,
            precipitation,
            windSpeed,
            waterAvailability,
            cropProblem
        } = req.body;

        if (!cropName || !soilType) {
            return res.status(400).json({
                message:
                    "Crop name and soil type are required"
            });
        }


        /*
         * =====================================================
         * RECOMMENDATION CODES
         * =====================================================
         */

        const recommendationCodes = [];

        const crop =
            String(cropName).toLowerCase();

        const soil =
            String(soilType).toLowerCase();

        const currentWeather =
            String(weather || "").toLowerCase();

        const temp =
            Number(temperature || 0);

        const humid =
            Number(humidity || 0);

        const rain =
            Number(precipitation || 0);

        const wind =
            Number(windSpeed || 0);

        const water =
            String(
                waterAvailability || ""
            ).toLowerCase();

        const problem =
            String(
                cropProblem || ""
            ).toLowerCase();


        /*
         * =====================================================
         * CROP RECOMMENDATIONS
         * =====================================================
         */

        if (crop.includes("tomato")) {
            recommendationCodes.push("tomato");
        }

        if (crop.includes("rice")) {
            recommendationCodes.push("rice");
        }

        if (crop.includes("potato")) {
            recommendationCodes.push("potato");
        }

        if (crop.includes("onion")) {
            recommendationCodes.push("onion");
        }

        if (crop.includes("carrot")) {
            recommendationCodes.push("carrot");
        }


        /*
         * =====================================================
         * SOIL RECOMMENDATIONS
         * =====================================================
         */

        if (soil.includes("sandy")) {
            recommendationCodes.push("soilSandy");
        }

        if (soil.includes("clay")) {
            recommendationCodes.push("soilClay");
        }

        if (soil.includes("loamy")) {
            recommendationCodes.push("soilLoamy");
        }

        if (soil.includes("black")) {
            recommendationCodes.push("soilBlack");
        }

        if (soil.includes("red")) {
            recommendationCodes.push("soilRed");
        }


        /*
         * =====================================================
         * WEATHER RECOMMENDATIONS
         * =====================================================
         */

        if (
            currentWeather.includes("rain")
        ) {
            recommendationCodes.push(
                "weatherRain"
            );
        }

        if (
            currentWeather.includes("sun")
        ) {
            recommendationCodes.push(
                "weatherSunny"
            );
        }

        if (
            currentWeather.includes("cloud")
        ) {
            recommendationCodes.push(
                "weatherCloudy"
            );
        }


        /*
         * =====================================================
         * TEMPERATURE
         * =====================================================
         */

        if (temp >= 35) {
            recommendationCodes.push(
                "temperatureHigh"
            );
        } else if (temp >= 30) {
            recommendationCodes.push(
                "temperatureWarm"
            );
        } else if (
            temp > 0 &&
            temp <= 15
        ) {
            recommendationCodes.push(
                "temperatureCool"
            );
        }


        /*
         * =====================================================
         * HUMIDITY
         * =====================================================
         */

        if (humid >= 80) {
            recommendationCodes.push(
                "humidityHigh"
            );
        } else if (
            humid > 0 &&
            humid <= 35
        ) {
            recommendationCodes.push(
                "humidityLow"
            );
        }


        /*
         * =====================================================
         * RAINFALL
         * =====================================================
         */

        if (rain > 5) {
            recommendationCodes.push(
                "rainHigh"
            );
        } else if (
            precipitation !== undefined &&
            rain === 0
        ) {
            recommendationCodes.push(
                "rainNone"
            );
        }


        /*
         * =====================================================
         * WIND
         * =====================================================
         */

        if (wind >= 30) {
            recommendationCodes.push(
                "windStrong"
            );
        } else if (wind >= 15) {
            recommendationCodes.push(
                "windModerate"
            );
        }


        /*
         * =====================================================
         * WATER
         * =====================================================
         */

        if (
            water.includes("low") ||
            water.includes("limited")
        ) {
            recommendationCodes.push(
                "waterLimited"
            );
        }

        if (
            water.includes("high") ||
            water.includes("good")
        ) {
            recommendationCodes.push(
                "waterGood"
            );
        }


        /*
         * =====================================================
         * CROP PROBLEM
         * =====================================================
         */

        if (
            problem &&
            problem !== "none"
        ) {
            recommendationCodes.push(
                "cropProblem"
            );
        }


        /*
         * =====================================================
         * DEFAULT
         * =====================================================
         */

        if (
            recommendationCodes.length === 0
        ) {
            recommendationCodes.push(
                "general"
            );
        }


        /*
         * =====================================================
         * REMOVE DUPLICATES
         * =====================================================
         */

        const uniqueRecommendationCodes =
            [
                ...new Set(
                    recommendationCodes
                )
            ];


        /*
         * =====================================================
         * ENGLISH BACKWARD COMPATIBILITY
         * =====================================================
         */

        const englishRecommendations = {
            tomato:
                "Monitor tomato plants for fungal diseases and maintain good airflow.",

            rice:
                "Maintain appropriate water levels and monitor the field for pests.",

            potato:
                "Use well-drained soil and monitor leaves for disease symptoms.",

            onion:
                "Avoid excessive irrigation and maintain good soil drainage.",

            carrot:
                "Maintain loose soil and consistent moisture for healthy root development.",

            soilSandy:
                "Sandy soil drains quickly. Use organic matter and maintain regular irrigation.",

            soilClay:
                "Clay soil can retain water. Improve drainage and avoid overwatering.",

            soilLoamy:
                "Loamy soil is generally suitable for many crops. Maintain balanced nutrients.",

            soilBlack:
                "Black soil generally retains moisture well. Monitor irrigation during wet periods.",

            soilRed:
                "Red soil may benefit from organic matter and balanced fertilization.",

            weatherRain:
                "Rain is expected. Avoid unnecessary irrigation and check drainage.",

            weatherSunny:
                "Sunny conditions are expected. Monitor soil moisture and irrigation needs.",

            weatherCloudy:
                "Cloudy conditions may reduce evaporation. Check soil moisture before irrigation.",

            temperatureHigh:
                "High temperature detected. Increase crop monitoring and provide adequate water.",

            temperatureWarm:
                "Warm conditions detected. Monitor soil moisture regularly.",

            temperatureCool:
                "Cool conditions detected. Monitor sensitive crops for slow growth.",

            humidityHigh:
                "High humidity may increase fungal disease risk. Improve ventilation and monitor leaves.",

            humidityLow:
                "Low humidity detected. Monitor crops for water stress.",

            rainHigh:
                "Recent rainfall is significant. Check field drainage and avoid excess irrigation.",

            rainNone:
                "No rainfall is reported. Check soil moisture and irrigation requirements.",

            windStrong:
                "Strong wind conditions detected. Protect young plants and support weak stems.",

            windModerate:
                "Moderate wind detected. Monitor exposed crops and irrigation evaporation.",

            waterLimited:
                "Water availability is limited. Prefer efficient irrigation and avoid unnecessary watering.",

            waterGood:
                "Water availability is good. Maintain crop-specific irrigation rather than overwatering.",

            cropProblem:
                `For the reported crop problem, ${cropProblem}, inspect affected plants early and consult a local agricultural expert if the problem spreads.`,

            general:
                "Maintain regular crop monitoring, balanced irrigation, soil nutrition and pest observation."
        };


        const recommendations =
            uniqueRecommendationCodes.map(
                (code) =>
                    englishRecommendations[
                        code
                    ] ||
                    englishRecommendations.general
            );


        /*
         * =====================================================
         * RESPONSE
         * =====================================================
         */

        return res.json({
            success: true,

            message:
                "Crop advisory generated successfully",

            advisory: {
                cropName,

                soilType,

                weather:
                    weather ||
                    "Not provided",

                temperature: temp,

                humidity: humid,

                precipitation: rain,

                windSpeed: wind,

                waterAvailability:
                    waterAvailability ||
                    "Not provided",

                cropProblem:
                    cropProblem ||
                    "None",

                recommendationCodes:
                    uniqueRecommendationCodes,

                recommendations
            }
        });

    } catch (error) {

        console.error(
            "Advisory Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Server error"
        });
    }
});


/*
 * ============================================================
 * AI DEMAND FORECASTING
 * ============================================================
 *
 * POST
 * /api/advisory/demand-forecast
 *
 * This is the first prototype version of the AgriVibe
 * demand forecasting engine.
 *
 * It uses the actual AgriVibe marketplace and order data:
 *
 * 1. Historical ordered quantity
 * 2. Number of orders
 * 3. Currently listed marketplace quantity
 * 4. Recent order activity
 *
 * This gives us a data-driven demand score.
 *
 * Later this can be replaced by a trained ML model without
 * changing the frontend API structure.
 *
 * ============================================================
 */

router.post(
    "/demand-forecast",
    async (req, res) => {

        try {

            const {
                cropName,
                state,
                district
            } = req.body;


            /*
             * =================================================
             * VALIDATION
             * =================================================
             */

            if (!cropName) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Crop name is required"
                });

            }


            /*
             * =================================================
             * LOAD REAL AGRIVIBE DATA
             * =================================================
             */

            const products =
                await getProducts({});

            const orders =
                await getOrders({});


            const requestedCrop =
                String(cropName)
                    .trim()
                    .toLowerCase();


            const requestedState =
                String(state || "")
                    .trim()
                    .toLowerCase();


            const requestedDistrict =
                String(district || "")
                    .trim()
                    .toLowerCase();


            /*
             * =================================================
             * FILTER MARKETPLACE PRODUCTS
             * =================================================
             */

            const cropProducts =
                products.filter(
                    (product) => {

                        const productCrop =
                            String(
                                product.cropName || ""
                            )
                                .trim()
                                .toLowerCase();

                        const productState =
                            String(
                                product.state || ""
                            )
                                .trim()
                                .toLowerCase();

                        const productDistrict =
                            String(
                                product.district || ""
                            )
                                .trim()
                                .toLowerCase();


                        const cropMatches =
                            productCrop ===
                            requestedCrop;


                        const stateMatches =
                            !requestedState ||
                            productState ===
                            requestedState;


                        const districtMatches =
                            !requestedDistrict ||
                            productDistrict ===
                            requestedDistrict;


                        return (
                            cropMatches &&
                            stateMatches &&
                            districtMatches
                        );

                    }
                );


            /*
             * =================================================
             * FILTER ORDERS
             * =================================================
             */

            const cropOrders =
                orders.filter(
                    (order) => {

                        const orderCrop =
                            String(
                                order.cropName || ""
                            )
                                .trim()
                                .toLowerCase();


                        return (
                            orderCrop ===
                            requestedCrop
                        );

                    }
                );


            /*
             * =================================================
             * BASIC MARKET DATA
             * =================================================
             */

            const totalListedQuantity =
                cropProducts.reduce(
                    (total, product) =>
                        total +
                        Number(
                            product.quantity || 0
                        ),
                    0
                );


            const totalOrderedQuantity =
                cropOrders.reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.quantity || 0
                        ),
                    0
                );


            const totalOrders =
                cropOrders.length;


            /*
             * =================================================
             * RECENT ORDERS
             * =================================================
             *
             * Orders from the last 30 days receive more
             * importance in the demand score.
             * =================================================
             */

            const now =
                Date.now();

            const thirtyDays =
                30 *
                24 *
                60 *
                60 *
                1000;


            const recentOrders =
                cropOrders.filter(
                    (order) => {

                        const created =
                            new Date(
                                order.createdAt
                            ).getTime();

                        return (
                            !Number.isNaN(created) &&
                            now - created <=
                            thirtyDays
                        );

                    }
                );


            const recentOrderedQuantity =
                recentOrders.reduce(
                    (total, order) =>
                        total +
                        Number(
                            order.quantity || 0
                        ),
                    0
                );


            /*
             * =================================================
             * DEMAND SCORE
             * =================================================
             *
             * Prototype scoring model:
             *
             * Historical demand
             * + recent demand
             * + order frequency
             * + marketplace supply pressure
             *
             * Score range: 0 - 100
             * =================================================
             */

            let demandScore = 0;


            /*
             * Historical quantity
             */

            if (
                totalOrderedQuantity >= 100
            ) {

                demandScore += 30;

            } else if (
                totalOrderedQuantity >= 50
            ) {

                demandScore += 22;

            } else if (
                totalOrderedQuantity >= 20
            ) {

                demandScore += 14;

            } else if (
                totalOrderedQuantity > 0
            ) {

                demandScore += 8;

            }


            /*
             * Recent demand
             */

            if (
                recentOrderedQuantity >= 50
            ) {

                demandScore += 30;

            } else if (
                recentOrderedQuantity >= 20
            ) {

                demandScore += 22;

            } else if (
                recentOrderedQuantity >= 5
            ) {

                demandScore += 14;

            } else if (
                recentOrderedQuantity > 0
            ) {

                demandScore += 7;

            }


            /*
             * Order frequency
             */

            if (
                totalOrders >= 10
            ) {

                demandScore += 20;

            } else if (
                totalOrders >= 5
            ) {

                demandScore += 15;

            } else if (
                totalOrders >= 2
            ) {

                demandScore += 10;

            } else if (
                totalOrders === 1
            ) {

                demandScore += 5;

            }


            /*
             * Supply pressure
             *
             * If demand is high while marketplace supply
             * is low, increase the score.
             */

            if (
                totalListedQuantity === 0 &&
                totalOrderedQuantity > 0
            ) {

                demandScore += 20;

            } else if (
                totalListedQuantity > 0 &&
                totalOrderedQuantity >
                totalListedQuantity
            ) {

                demandScore += 20;

            } else if (
                totalListedQuantity > 0 &&
                totalOrderedQuantity >=
                totalListedQuantity * 0.5
            ) {

                demandScore += 12;

            } else if (
                totalOrderedQuantity > 0
            ) {

                demandScore += 6;

            }


            /*
             * Keep score between 0 and 100
             */

            demandScore =
                Math.max(
                    0,
                    Math.min(
                        100,
                        Math.round(
                            demandScore
                        )
                    )
                );


            /*
             * =================================================
             * DEMAND LEVEL
             * =================================================
             */

            let demandLevel;

            if (
                demandScore >= 70
            ) {

                demandLevel = "High";

            } else if (
                demandScore >= 40
            ) {

                demandLevel = "Medium";

            } else {

                demandLevel = "Low";

            }


            /*
             * =================================================
             * EXPECTED DEMAND
             * =================================================
             *
             * Prototype estimate based on historical and
             * recent order activity.
             * =================================================
             */

            let expectedDemand;


            if (
                recentOrderedQuantity > 0
            ) {

                expectedDemand =
                    Math.max(
                        1,
                        Math.round(
                            recentOrderedQuantity *
                            1.15
                        )
                    );

            } else if (
                totalOrderedQuantity > 0
            ) {

                expectedDemand =
                    Math.max(
                        1,
                        Math.round(
                            totalOrderedQuantity /
                            Math.max(
                                1,
                                totalOrders
                            )
                        )
                    );

            } else {

                expectedDemand = 0;

            }


            /*
             * =================================================
             * MARKET SUPPLY STATUS
             * =================================================
             */

            let supplyStatus;

            if (
                totalListedQuantity === 0
            ) {

                supplyStatus = "No active supply";

            } else if (
                expectedDemand >
                totalListedQuantity
            ) {

                supplyStatus = "Supply may be insufficient";

            } else if (
                totalListedQuantity >
                expectedDemand * 2
            ) {

                supplyStatus = "Supply is currently high";

            } else {

                supplyStatus = "Supply is balanced";

            }


            /*
             * =================================================
             * FARMER ACTION
             * =================================================
             */

            let recommendationCode;

            if (
                demandLevel === "High"
            ) {

                recommendationCode =
                    "listCropNow";

            } else if (
                demandLevel === "Medium"
            ) {

                recommendationCode =
                    "monitorDemand";

            } else {

                recommendationCode =
                    "waitAndMonitor";

            }


            /*
             * =================================================
             * RESPONSE
             * =================================================
             */

            return res.json({

                success: true,

                message:
                    "Demand forecast generated successfully",

                forecast: {

                    cropName,

                    state:
                        state ||
                        "All locations",

                    district:
                        district ||
                        "All locations",

                    demandScore,

                    demandLevel,

                    expectedDemand,

                    unit:
                        "kg",

                    historicalOrderedQuantity:
                        totalOrderedQuantity,

                    recentOrderedQuantity,

                    totalOrders,

                    currentListedQuantity:
                        totalListedQuantity,

                    supplyStatus,

                    recommendationCode,

                    dataPoints:
                        cropProducts.length +
                        cropOrders.length

                }

            });

        } catch (error) {

            console.error(
                "Demand Forecast Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to generate demand forecast"

            });

        }

    }
);


module.exports = router;