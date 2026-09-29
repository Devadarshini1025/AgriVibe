const express = require("express");
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct
} = require("../dataStore");

const router = express.Router();

/*
 * Prototype reference prices.
 * These are sample reference prices for the demo,
 * not live mandi prices.
 */
const REFERENCE_PRICES = {
    tomato: 30,
    potato: 25,
    onion: 28,
    rice: 40,
    carrot: 35,
    brinjal: 32,
    cabbage: 30,
    cauliflower: 35,
    cucumber: 28,
    ladyfinger: 40,
    okra: 40,
    spinach: 25,
    wheat: 35,
    maize: 30,
    groundnut: 70,
    banana: 45,
    mango: 60,
    apple: 120
};

const CROP_ALIASES = {
    tomatoes: "tomato",
    potatoes: "potato",
    onions: "onion",
    carrots: "carrot",
    brinjals: "brinjal",
    aubergine: "brinjal",
    cabbages: "cabbage",
    cauliflowers: "cauliflower",
    cucumbers: "cucumber",
    okra: "okra",
    "lady finger": "ladyfinger",
    "lady-finger": "ladyfinger",
    spinach: "spinach",
    wheats: "wheat",
    maize: "maize",
    corn: "maize",
    groundnuts: "groundnut",
    bananas: "banana",
    mangoes: "mango",
    apples: "apple"
};

function normalizeCropName(cropName) {
    return String(cropName || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getReferencePrice(cropName) {
    const normalized = normalizeCropName(cropName);

    const key =
        CROP_ALIASES[normalized] ||
        normalized.replace(/\s+/g, "");

    return REFERENCE_PRICES[key] || 30;
}

function calculatePricing(pricePerKg, referencePrice) {
    const priceDifference =
        Number(pricePerKg) - Number(referencePrice);

    const priceDifferencePercentage =
        referencePrice > 0
            ? (priceDifference / referencePrice) * 100
            : 0;

    let priceStatus = "Fair";

    if (priceDifferencePercentage < -5) {
        priceStatus = "Below Reference";
    } else if (priceDifferencePercentage > 5) {
        priceStatus = "Above Reference";
    }

    return {
        priceDifference: Number(priceDifference.toFixed(2)),
        farmerBenefit: Number(
            Math.max(priceDifferencePercentage, 0).toFixed(2)
        ),
        consumerSaving: Number(
            Math.max(-priceDifferencePercentage, 0).toFixed(2)
        ),
        priceStatus
    };
}

/*
 * ADD PRODUCT
 */
router.post("/add", async (req, res) => {
    try {
        const {
            cropName,
            quantity,
            pricePerKg,
            harvestDate,
            state,
            district,
            villageTown,
            pickupPoint,
            farmerName
        } = req.body;

        if (
            !cropName ||
            quantity === undefined ||
            pricePerKg === undefined ||
            !harvestDate ||
            !state ||
            !district ||
            !villageTown ||
            !farmerName
        ) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        if (Number(quantity) <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        if (Number(pricePerKg) <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
        }

        const referencePrice = getReferencePrice(cropName);

        const pricing = calculatePricing(
            Number(pricePerKg),
            referencePrice
        );

        const product = await createProduct({
            cropName: cropName.trim(),
            quantity: Number(quantity),
            pricePerKg: Number(pricePerKg),
            harvestDate,
            state: state.trim(),
            district: district.trim(),
            villageTown: villageTown.trim(),
            pickupPoint: pickupPoint ? pickupPoint.trim() : "",
            farmerName: farmerName.trim(),
            referencePrice,
            priceDifference: pricing.priceDifference,
            farmerBenefit: pricing.farmerBenefit,
            consumerSaving: pricing.consumerSaving,
            priceStatus: pricing.priceStatus
        });

        res.status(201).json({
            success: true,
            message: "Crop added successfully",
            product
        });
    } catch (error) {
        console.error("Add Product Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

/*
 * GET PRODUCTS
 */
router.get("/", async (req, res) => {
    try {
        const { search, farmerName } = req.query;

        const products = await getProducts({ search, farmerName });

        const normalizedProducts = [];

        for (const product of products) {
            const prodObj = product.toObject ? product.toObject() : { ...product };
            const referencePrice = getReferencePrice(prodObj.cropName);
            const pricing = calculatePricing(prodObj.pricePerKg, referencePrice);

            normalizedProducts.push({
                ...prodObj,
                referencePrice,
                priceDifference: pricing.priceDifference,
                farmerBenefit: pricing.farmerBenefit,
                consumerSaving: pricing.consumerSaving,
                priceStatus: pricing.priceStatus
            });
        }

        res.json(normalizedProducts);
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

/*
 * GET SINGLE PRODUCT
 */
router.get("/:id", async (req, res) => {
    try {
        const product = await getProductById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const prodObj = product.toObject ? product.toObject() : { ...product };
        const referencePrice = getReferencePrice(prodObj.cropName);
        const pricing = calculatePricing(prodObj.pricePerKg, referencePrice);

        res.json({
            ...prodObj,
            referencePrice,
            ...pricing
        });
    } catch (error) {
        console.error("Get Product Error:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;