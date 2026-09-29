const express = require("express");
const crypto = require("crypto");

const {
    getOrderById,
    updateOrder
} = require("../dataStore");

const router = express.Router();

/*
=========================================================
CREATE DEMO PAYMENT
=========================================================
*/

router.post("/create", async (req, res) => {
    try {
        const {
            orderId,
            buyerEmail
        } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        /*
        Make sure the buyer owns the order.
        */

        if (
            buyerEmail &&
            String(order.buyerEmail).toLowerCase() !==
                String(buyerEmail).toLowerCase()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to pay for this order"
            });
        }

        /*
        Already paid?
        */

        if (order.paymentStatus === "Paid") {
            return res.json({
                success: true,
                alreadyPaid: true,
                message: "Order is already paid",
                order
            });
        }

        /*
        Rejected orders cannot be paid.
        */

        if (order.status === "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Rejected orders cannot be paid"
            });
        }

        res.json({
            success: true,

            payment: {
                orderId: order._id,
                cropName: order.cropName,
                farmerName: order.farmerName,
                quantity: order.quantity,
                pricePerKg: order.pricePerKg,
                totalPrice: order.totalPrice,

                demoMode: true,

                message:
                    "This is a demo payment. No real money will be transferred."
            }
        });

    } catch (error) {

        console.error(
            "Create Demo Payment Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to create demo payment"
        });
    }
});


/*
=========================================================
CONFIRM DEMO PAYMENT
=========================================================
*/

router.post("/confirm", async (req, res) => {
    try {

        const {
            orderId,
            buyerEmail,
            paymentMethod
        } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Payment method is required"
            });
        }

        const allowedMethods = [
            "UPI",
            "Card",
            "Cash on Delivery"
        ];

        if (!allowedMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        const order = await getOrderById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        /*
        Buyer ownership check.
        */

        if (
            buyerEmail &&
            String(order.buyerEmail).toLowerCase() !==
                String(buyerEmail).toLowerCase()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to pay for this order"
            });
        }

        /*
        Prevent duplicate payment.
        */

        if (order.paymentStatus === "Paid") {
            return res.json({
                success: true,
                alreadyPaid: true,
                message: "Order is already paid",
                order
            });
        }

        /*
        Rejected order cannot be paid.
        */

        if (order.status === "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Rejected orders cannot be paid"
            });
        }

        /*
        =================================================
        CASH ON DELIVERY
        =================================================
        */

        if (paymentMethod === "Cash on Delivery") {

            const updatedOrder =
                await updateOrder(
                    orderId,
                    {
                        paymentMethod:
                            "Cash on Delivery",

                        paymentStatus:
                            "COD",

                        paymentId:
                            "",

                        paidAt:
                            null
                    }
                );

            return res.json({
                success: true,

                message:
                    "Cash on Delivery selected",

                demoMode: true,

                paymentStatus:
                    "COD",

                order:
                    updatedOrder
            });
        }

        /*
        =================================================
        DEMO DIGITAL PAYMENT
        =================================================

        UPI/Card are simulated.
        No real transaction happens.
        */

        const paymentId =
            "AGV-DEMO-" +
            Date.now() +
            "-" +
            crypto
                .randomBytes(3)
                .toString("hex")
                .toUpperCase();

        const updatedOrder =
            await updateOrder(
                orderId,
                {
                    paymentMethod:
                        paymentMethod,

                    paymentStatus:
                        "Paid",

                    paymentId:
                        paymentId,

                    paidAt:
                        new Date()
                }
            );

        res.json({
            success: true,

            message:
                "Demo payment successful",

            demoMode: true,

            paymentStatus:
                "Paid",

            paymentId:
                paymentId,

            paidAt:
                updatedOrder.paidAt,

            order:
                updatedOrder
        });

    } catch (error) {

        console.error(
            "Confirm Demo Payment Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to confirm demo payment"
        });
    }
});


/*
=========================================================
GET PAYMENT STATUS
=========================================================
*/

router.get("/:orderId", async (req, res) => {

    try {

        const order =
            await getOrderById(
                req.params.orderId
            );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,

            orderId:
                order._id,

            paymentStatus:
                order.paymentStatus ||
                "Pending",

            paymentMethod:
                order.paymentMethod ||
                "",

            paymentId:
                order.paymentId ||
                "",

            paidAt:
                order.paidAt ||
                null
        });

    } catch (error) {

        console.error(
            "Get Payment Status Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Unable to get payment status"
        });
    }
});


module.exports = router;