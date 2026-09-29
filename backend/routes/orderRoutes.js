const express = require("express");

const {
    getProductById,
    updateProduct,
    createOrder,
    getOrders,
    getOrderById,
    updateOrder
} = require("../dataStore");

const router = express.Router();

/*
 * ============================================
 * PLACE ORDER
 * ============================================
 */
router.post("/add", async (req, res) => {
    try {
        const {
            productId,
            buyerName,
            buyerEmail,
            quantity,
            deliveryLocation
        } = req.body;

        /*
         * Check basic order details
         */
        if (
            !productId ||
            !buyerName ||
            !buyerEmail ||
            quantity === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all order details"
            });
        }

        /*
         * Check delivery location
         */
        if (!deliveryLocation) {
            return res.status(400).json({
                message: "Please provide delivery location"
            });
        }

        const {
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            method
        } = deliveryLocation;

        if (
            !address ||
            !city ||
            !state ||
            !pincode
        ) {
            return res.status(400).json({
                message:
                    "Please provide complete delivery address"
            });
        }

        /*
         * Validate quantity
         */
        const orderQuantity = Number(quantity);

        if (
            Number.isNaN(orderQuantity) ||
            orderQuantity <= 0
        ) {
            return res.status(400).json({
                message:
                    "Quantity must be greater than 0"
            });
        }

        /*
         * Find product
         */
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        /*
         * Check available quantity
         */
        if (product.quantity < orderQuantity) {
            return res.status(400).json({
                message:
                    "Insufficient quantity available"
            });
        }

        /*
         * Calculate total price
         */
        const totalPrice =
            orderQuantity * Number(product.pricePerKg);

        /*
         * Create order
         */
        const order = await createOrder({
            productId: product._id,

            cropName: product.cropName,

            farmerName: product.farmerName,

            buyerName: buyerName.trim(),

            buyerEmail: buyerEmail
                .trim()
                .toLowerCase(),

            quantity: orderQuantity,

            pricePerKg: Number(product.pricePerKg),

            totalPrice,

            deliveryLocation: {
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                pincode: pincode.trim(),

                latitude:
                    latitude !== undefined &&
                    latitude !== null
                        ? Number(latitude)
                        : null,

                longitude:
                    longitude !== undefined &&
                    longitude !== null
                        ? Number(longitude)
                        : null,

                method:
                    method === "current"
                        ? "current"
                        : "manual"
            },

            status: "Pending"
        });

        /*
         * Reduce available product quantity
         */
        await updateProduct(product._id, {
            quantity:
                Number(product.quantity) -
                orderQuantity
        });

        /*
         * Send success response
         */
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        console.error(
            "Place Order Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


/*
 * ============================================
 * GET ORDERS
 *
 * Buyer:
 * /api/orders?buyerEmail=example@gmail.com
 *
 * Farmer:
 * /api/orders?farmerName=FarmerName
 * ============================================
 */
router.get("/", async (req, res) => {
    try {
        const {
            buyerEmail,
            farmerName
        } = req.query;

        const orders = await getOrders({
            buyerEmail,
            farmerName
        });

        res.json(orders);
    } catch (error) {
        console.error(
            "Get Orders Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


/*
 * ============================================
 * GET SINGLE ORDER
 * ============================================
 */
router.get("/:id", async (req, res) => {
    try {
        const order = await getOrderById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json(order);
    } catch (error) {
        console.error(
            "Get Order Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


/*
 * ============================================
 * ACCEPT ORDER
 * ============================================
 */
router.put("/:id/accept", async (req, res) => {
    try {
        const order = await getOrderById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({
                message:
                    "Only pending orders can be accepted"
            });
        }

        const updatedOrder = await updateOrder(
            req.params.id,
            {
                status: "Accepted"
            }
        );

        res.json({
            success: true,
            message: "Order accepted successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error(
            "Accept Order Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


/*
 * ============================================
 * REJECT ORDER
 * ============================================
 */
router.put("/:id/reject", async (req, res) => {
    try {
        const order = await getOrderById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.status !== "Pending") {
            return res.status(400).json({
                message:
                    "Only pending orders can be rejected"
            });
        }

        const updatedOrder = await updateOrder(
            req.params.id,
            {
                status: "Rejected"
            }
        );

        res.json({
            success: true,
            message: "Order rejected successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.error(
            "Reject Order Error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
});


/*
 * ============================================
 * EXPORT ROUTER
 * ============================================
 */
module.exports = router;