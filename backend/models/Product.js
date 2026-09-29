const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        cropName: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0
        },

        pricePerKg: {
            type: Number,
            required: true,
            min: 0
        },

        harvestDate: {
            type: Date,
            required: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        district: {
            type: String,
            required: true,
            trim: true
        },

        villageTown: {
            type: String,
            required: true,
            trim: true
        },

        pickupPoint: {
            type: String,
            default: "",
            trim: true
        },

        farmerName: {
            type: String,
            required: true,
            trim: true
        },

        referencePrice: {
            type: Number,
            required: true,
            min: 0
        },

        priceDifference: {
            type: Number,
            default: 0
        },

        farmerBenefit: {
            type: Number,
            default: 0
        },

        consumerSaving: {
            type: Number,
            default: 0
        },

        priceStatus: {
            type: String,
            enum: [
                "Fair",
                "Below Reference",
                "Above Reference"
            ],
            default: "Fair"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Product",
    productSchema
);