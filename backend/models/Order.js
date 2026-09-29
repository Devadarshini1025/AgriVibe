const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        cropName: {
            type: String,
            required: true,
            trim: true
        },

        farmerName: {
            type: String,
            required: true,
            trim: true
        },

        buyerName: {
            type: String,
            required: true,
            trim: true
        },

        buyerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        pricePerKg: {
            type: Number,
            required: true,
            min: 0
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryLocation: {
            address: {
                type: String,
                required: true,
                trim: true
            },

            city: {
                type: String,
                required: true,
                trim: true
            },

            state: {
                type: String,
                required: true,
                trim: true
            },

            pincode: {
                type: String,
                required: true,
                trim: true
            },

            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            },

            method: {
                type: String,
                enum: ["manual", "current"],
                default: "manual"
            }
        },

        /*
        =====================================================
        ORDER STATUS
        =====================================================
        */

        status: {
            type: String,
            enum: [
                "Pending",
                "Accepted",
                "Rejected"
            ],
            default: "Pending"
        },

        /*
        =====================================================
        DEMO PAYMENT DETAILS
        =====================================================
        */

        paymentStatus: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "COD"
            ],
            default: "Pending"
        },

        paymentMethod: {
            type: String,
            enum: [
                "UPI",
                "Card",
                "Cash on Delivery",
                ""
            ],
            default: ""
        },

        paymentId: {
            type: String,
            default: ""
        },

        paidAt: {
            type: Date,
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Order",
    orderSchema
);