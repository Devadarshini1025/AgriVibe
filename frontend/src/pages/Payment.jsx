import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";
import API_URL from "../apiConfig";

function Payment() {
    const { t, tCrop, language } = useLanguage();

    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState("UPI");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [paymentId, setPaymentId] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paidAt, setPaidAt] = useState(null);

    /*
    =====================================================
    CURRENT USER
    =====================================================
    */

    const getCurrentUser = () => {
        try {
            const savedUser = localStorage.getItem("user");

            if (!savedUser) {
                return null;
            }

            return JSON.parse(savedUser);
        } catch (err) {
            console.error("Unable to read user:", err);
            return null;
        }
    };

    /*
    =====================================================
    LOAD ORDER
    =====================================================
    */

    useEffect(() => {
        const loadOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const user = getCurrentUser();

                if (!user) {
                    navigate("/login");
                    return;
                }

                if (user.role !== "buyer") {
                    setError(
                        t("onlyBuyersCanMakePayments") ||
                            "Only buyers can make payments."
                    );

                    setLoading(false);
                    return;
                }

                if (!orderId) {
                    setError(
                        t("orderIdMissing") ||
                            "Order ID is missing."
                    );

                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `${API_URL}/api/orders/${orderId}`
                );

                const loadedOrder =
                    response.data?.order ||
                    response.data;

                if (
                    loadedOrder?.buyerEmail &&
                    user.email &&
                    loadedOrder.buyerEmail.toLowerCase() !==
                        user.email.toLowerCase()
                ) {
                    setError(
                        t("notAllowedToPay") ||
                            "You are not allowed to pay for this order."
                    );

                    setLoading(false);
                    return;
                }

                setOrder(loadedOrder);

                if (loadedOrder?.paymentStatus === "Paid") {
                    setPaymentStatus("Paid");

                    setPaymentId(
                        loadedOrder.paymentId || ""
                    );

                    setPaidAt(
                        loadedOrder.paidAt || null
                    );

                    setSuccess(true);
                }

                if (loadedOrder?.paymentStatus === "COD") {
                    setPaymentStatus("COD");
                    setSelectedMethod("Cash on Delivery");
                    setSuccess(true);
                }
            } catch (err) {
                console.error(
                    "Payment page error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                        t("unableToLoadOrder") ||
                        "Unable to load order."
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, [orderId, navigate, language]);

    /*
    =====================================================
    START DEMO PAYMENT
    =====================================================
    */

    const handlePayment = async () => {
        try {
            setProcessing(true);
            setError("");

            const user = getCurrentUser();

            if (!user) {
                navigate("/login");
                return;
            }

            /*
            =========================================
            STEP 1
            CREATE DEMO PAYMENT
            =========================================
            */

            const createResponse = await axios.post(
                `${API_URL}/api/payments/create`,
                {
                    orderId: orderId,
                    buyerEmail: user.email
                }
            );

            if (!createResponse.data?.success) {
                throw new Error(
                    createResponse.data?.message ||
                        t("unableToCreatePayment") ||
                        "Unable to create payment."
                );
            }

            /*
            =========================================
            SMALL DEMO PROCESSING DELAY
            =========================================
            */

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );

            /*
            =========================================
            STEP 2
            CONFIRM DEMO PAYMENT
            =========================================
            */

            const confirmResponse = await axios.post(
                `${API_URL}/api/payments/confirm`,
                {
                    orderId: orderId,
                    buyerEmail: user.email,
                    paymentMethod: selectedMethod
                }
            );

            if (!confirmResponse.data?.success) {
                throw new Error(
                    confirmResponse.data?.message ||
                        t("paymentFailed") ||
                        "Payment failed."
                );
            }

            const result = confirmResponse.data;

            setPaymentStatus(
                result.paymentStatus || "Paid"
            );

            setPaymentId(
                result.paymentId || ""
            );

            setPaidAt(
                result.paidAt || null
            );

            setSuccess(true);

            if (result.order) {
                setOrder(result.order);
            }
        } catch (err) {
            console.error(
                "Demo payment error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    t("paymentFailedTryAgain") ||
                    "Payment failed. Please try again."
            );
        } finally {
            setProcessing(false);
        }
    };

    /*
    =====================================================
    LOADING
    =====================================================
    */

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <div
                        className="spinner-border text-success"
                        role="status"
                    />

                    <p className="mt-3">
                        {t("loadingPayment") ||
                            "Loading payment..."}
                    </p>
                </div>
            </div>
        );
    }

    /*
    =====================================================
    ERROR
    =====================================================
    */

    if (error && !order) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    <h5>
                        {t("paymentError") ||
                            "Payment Error"}
                    </h5>

                    <p className="mb-3">
                        {error}
                    </p>

                    <button
                        className="btn btn-success"
                        onClick={() =>
                            navigate(
                                "/buyer-dashboard"
                            )
                        }
                    >
                        {t("backToOrders") ||
                            "Back to Orders"}
                    </button>
                </div>
            </div>
        );
    }

    /*
    =====================================================
    PAYMENT SUCCESS
    =====================================================
    */

    if (success) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-lg">
                            <div className="card-body text-center p-5">

                                <div className="display-1 mb-3">
                                    {paymentStatus === "COD"
                                        ? "📦"
                                        : "✅"}
                                </div>

                                <h2 className="text-success fw-bold">
                                    {paymentStatus === "COD"
                                        ? t(
                                              "cashOnDeliverySelected"
                                          ) ||
                                          "Cash on Delivery Selected"
                                        : t(
                                              "paymentSuccessful"
                                          ) ||
                                          "Payment Successful!"}
                                </h2>

                                <p className="text-muted">
                                    {paymentStatus === "COD"
                                        ? t(
                                              "orderPlacedWithCOD"
                                          ) ||
                                          "Your order has been placed with Cash on Delivery."
                                        : t(
                                              "agrivibeDemoPaymentCompleted"
                                          ) ||
                                          "Your AgriVibe demo payment has been completed successfully."}
                                </p>

                                <div className="alert alert-light border text-start mt-4">

                                    <h5 className="fw-bold">
                                        {t("orderSummary") ||
                                            "Order Summary"}
                                    </h5>

                                    <hr />

                                    <p>
                                        <strong>
                                            {t("crop") ||
                                                "Crop"}:
                                        </strong>{" "}
                                        {tCrop(
                                            order?.cropName
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("quantity") ||
                                                "Quantity"}:
                                        </strong>{" "}
                                        {order?.quantity} kg
                                    </p>

                                    <p>
                                        <strong>
                                            {t("price") ||
                                                "Price"}:
                                        </strong>{" "}
                                        ₹
                                        {Number(
                                            order?.pricePerKg ||
                                                0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                        /kg
                                    </p>

                                    <p>
                                        <strong>
                                            {t("total") ||
                                                "Total"}:
                                        </strong>{" "}
                                        ₹
                                        {Number(
                                            order?.totalPrice ||
                                                0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "paymentMethod"
                                            ) ||
                                                "Payment Method"}:
                                        </strong>{" "}
                                        {selectedMethod ===
                                        "Cash on Delivery"
                                            ? t(
                                                  "cashOnDelivery"
                                              ) ||
                                              "Cash on Delivery"
                                            : selectedMethod}
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "paymentStatus"
                                            ) ||
                                                "Payment Status"}:
                                        </strong>{" "}

                                        <span className="badge bg-success">
                                            {paymentStatus ===
                                            "Paid"
                                                ? t("paid") ||
                                                  "Paid"
                                                : paymentStatus ===
                                                  "COD"
                                                ? t(
                                                      "cashOnDelivery"
                                                  ) ||
                                                  "Cash on Delivery"
                                                : paymentStatus}
                                        </span>
                                    </p>

                                    {paymentId && (
                                        <p>
                                            <strong>
                                                {t(
                                                    "paymentId"
                                                ) ||
                                                    "Payment ID"}:
                                            </strong>{" "}

                                            <span className="text-success">
                                                {paymentId}
                                            </span>
                                        </p>
                                    )}

                                    {paidAt && (
                                        <p>
                                            <strong>
                                                {t("paidAt") ||
                                                    "Paid At"}:
                                            </strong>{" "}

                                            {new Date(
                                                paidAt
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>
                                    )}
                                </div>

                                <div className="alert alert-info">
                                    <strong>
                                        {t(
                                            "demoPayment"
                                        ) ||
                                            "Demo Payment"}
                                    </strong>

                                    <br />

                                    {t(
                                        "noRealMoneyTransferred"
                                    ) ||
                                        "No real money was transferred."}{" "}

                                    {t(
                                        "paymentSimulatedPrototype"
                                    ) ||
                                        "This payment is simulated for the AgriVibe prototype."}
                                </div>

                                <div className="d-flex gap-2 justify-content-center flex-wrap">

                                    <button
                                        className="btn btn-success"
                                        onClick={() =>
                                            navigate(
                                                "/buyer-dashboard"
                                            )
                                        }
                                    >
                                        {t(
                                            "viewMyOrders"
                                        ) ||
                                            "View My Orders"}
                                    </button>

                                    <button
                                        className="btn btn-outline-success"
                                        onClick={() =>
                                            navigate(
                                                "/marketplace"
                                            )
                                        }
                                    >
                                        {t(
                                            "continueShopping"
                                        ) ||
                                            "Continue Shopping"}
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /*
    =====================================================
    MAIN PAYMENT PAGE
    =====================================================
    */

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div className="text-center mb-4">

                        <h1 className="fw-bold text-success">
                            🌱 {t("appName") ||
                                "AgriVibe"}{" "}
                            {t("pay") || "Pay"}
                        </h1>

                        <p className="text-muted">
                            {t(
                                "secureDemoPayment"
                            ) ||
                                "Secure Demo Payment"}
                        </p>

                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            {error}
                        </div>
                    )}

                    <div className="row g-4">

                        {/* ORDER SUMMARY */}

                        <div className="col-md-6">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold">
                                        🧾{" "}
                                        {t(
                                            "orderSummary"
                                        ) ||
                                            "Order Summary"}
                                    </h4>

                                    <hr />

                                    <p>
                                        <strong>
                                            {t("crop") ||
                                                "Crop"}:
                                        </strong>{" "}
                                        {tCrop(
                                            order?.cropName
                                        )}
                                    </p>

                                    <p>
                                        <strong>
                                            {t("farmer") ||
                                                "Farmer"}:
                                        </strong>{" "}
                                        {order?.farmerName}
                                    </p>

                                    <p>
                                        <strong>
                                            {t(
                                                "quantity"
                                            ) ||
                                                "Quantity"}:
                                        </strong>{" "}
                                        {order?.quantity} kg
                                    </p>

                                    <p>
                                        <strong>
                                            {t("price") ||
                                                "Price"}:
                                        </strong>{" "}
                                        ₹
                                        {Number(
                                            order?.pricePerKg ||
                                                0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                        /kg
                                    </p>

                                    <hr />

                                    <div className="d-flex justify-content-between">

                                        <strong>
                                            {t(
                                                "totalAmount"
                                            ) ||
                                                "Total Amount"}
                                        </strong>

                                        <strong className="text-success fs-4">
                                            ₹
                                            {Number(
                                                order?.totalPrice ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                    </div>

                                    {order?.deliveryLocation && (
                                        <div className="mt-4">

                                            <h6 className="fw-bold">
                                                📍{" "}
                                                {t(
                                                    "deliveryLocation"
                                                ) ||
                                                    "Delivery Location"}
                                            </h6>

                                            <p className="small text-muted mb-0">
                                                {
                                                    order
                                                        .deliveryLocation
                                                        .address
                                                }
                                            </p>

                                            <p className="small text-muted">
                                                {
                                                    order
                                                        .deliveryLocation
                                                        .city
                                                }
                                                ,{" "}
                                                {
                                                    order
                                                        .deliveryLocation
                                                        .state
                                                }{" "}
                                                -{" "}
                                                {
                                                    order
                                                        .deliveryLocation
                                                        .pincode
                                                }
                                            </p>

                                        </div>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* PAYMENT METHOD */}

                        <div className="col-md-6">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <h4 className="fw-bold">
                                        💳{" "}
                                        {t(
                                            "paymentMethod"
                                        ) ||
                                            "Payment Method"}
                                    </h4>

                                    <p className="text-muted small">
                                        {t(
                                            "chooseDemoPaymentMethod"
                                        ) ||
                                            "Choose a demo payment method."}
                                    </p>

                                    {/* UPI */}

                                    <div
                                        className={`border rounded p-3 mb-3 ${
                                            selectedMethod ===
                                            "UPI"
                                                ? "border-success bg-light"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedMethod(
                                                "UPI"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >

                                        <div className="form-check">

                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                checked={
                                                    selectedMethod ===
                                                    "UPI"
                                                }
                                                onChange={() =>
                                                    setSelectedMethod(
                                                        "UPI"
                                                    )
                                                }
                                            />

                                            <label className="form-check-label">

                                                <strong>
                                                    📱 UPI
                                                </strong>

                                                <br />

                                                <small className="text-muted">
                                                    {t(
                                                        "demoUPIPayment"
                                                    ) ||
                                                        "Demo UPI payment"}
                                                </small>

                                            </label>

                                        </div>
                                    </div>

                                    {/* CARD */}

                                    <div
                                        className={`border rounded p-3 mb-3 ${
                                            selectedMethod ===
                                            "Card"
                                                ? "border-success bg-light"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedMethod(
                                                "Card"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >

                                        <div className="form-check">

                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                checked={
                                                    selectedMethod ===
                                                    "Card"
                                                }
                                                onChange={() =>
                                                    setSelectedMethod(
                                                        "Card"
                                                    )
                                                }
                                            />

                                            <label className="form-check-label">

                                                <strong>
                                                    💳{" "}
                                                    {t(
                                                        "card"
                                                    ) ||
                                                        "Card"}
                                                </strong>

                                                <br />

                                                <small className="text-muted">
                                                    {t(
                                                        "demoCardPayment"
                                                    ) ||
                                                        "Demo card payment"}
                                                </small>

                                            </label>

                                        </div>
                                    </div>

                                    {/* COD */}

                                    <div
                                        className={`border rounded p-3 mb-4 ${
                                            selectedMethod ===
                                            "Cash on Delivery"
                                                ? "border-success bg-light"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedMethod(
                                                "Cash on Delivery"
                                            )
                                        }
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >

                                        <div className="form-check">

                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                checked={
                                                    selectedMethod ===
                                                    "Cash on Delivery"
                                                }
                                                onChange={() =>
                                                    setSelectedMethod(
                                                        "Cash on Delivery"
                                                    )
                                                }
                                            />

                                            <label className="form-check-label">

                                                <strong>
                                                    📦{" "}
                                                    {t(
                                                        "cashOnDelivery"
                                                    ) ||
                                                        "Cash on Delivery"}
                                                </strong>

                                                <br />

                                                <small className="text-muted">
                                                    {t(
                                                        "payWhenDelivered"
                                                    ) ||
                                                        "Pay when the crop is delivered"}
                                                </small>

                                            </label>

                                        </div>
                                    </div>

                                    <button
                                        className="btn btn-success btn-lg w-100"
                                        onClick={
                                            handlePayment
                                        }
                                        disabled={
                                            processing
                                        }
                                    >

                                        {processing ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />

                                                {t(
                                                    "processing"
                                                ) ||
                                                    "Processing..."}
                                            </>
                                        ) : (
                                            <>
                                                🔒{" "}

                                                {selectedMethod ===
                                                "Cash on Delivery"
                                                    ? t(
                                                          "confirmOrder"
                                                      ) ||
                                                      "Confirm Order"
                                                    : (
                                                          t(
                                                              "payAmount"
                                                          ) ||
                                                          "Pay"
                                                      ) +
                                                      " ₹" +
                                                      Number(
                                                          order?.totalPrice ||
                                                              0
                                                      ).toLocaleString(
                                                          "en-IN"
                                                      )}
                                            </>
                                        )}

                                    </button>

                                    <div className="alert alert-warning mt-3 small mb-0">

                                        <strong>
                                            {t(
                                                "demoMode"
                                            ) ||
                                                "Demo Mode"}:
                                        </strong>{" "}

                                        {t(
                                            "noRealPayment"
                                        ) ||
                                            "No real payment or financial information is processed."}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Payment;