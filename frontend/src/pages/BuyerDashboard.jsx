import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

function BuyerDashboard() {
    const { t, tCrop, language } = useLanguage();


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const fetchOrders = async () => {
        if (!user) return;

        try {
            const response =
                await axios.get(
                    "http://localhost:5000/api/orders",
                    {
                        params: {
                            buyerEmail:
                                user.email
                        }
                    }
                );

            setOrders(response.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    {t("buyerLoginMessage")}
                    <br />

                    <Link
                        to="/login"
                        className="btn btn-success mt-3"
                    >
                        {t("login")}
                    </Link>
                </div>
            </div>
        );
    }

    if (user.role !== "buyer") {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {t("buyerLoginRequired")}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="page-title">
                        🛒 {t("myOrders")}
                    </h2>

                    <p className="text-muted">
                        {t("welcomeUser")}{" "}
                        <strong>
                            {user.name}
                        </strong>
                    </p>
                </div>

                <Link
                    to="/marketplace"
                    className="btn btn-success"
                >
                    🛒 {t("marketplace")}
                </Link>
            </div>

            {loading ? (
                <p>{t("loadingOrders")}</p>
            ) : orders.length === 0 ? (
                <div className="alert alert-light border text-center">
                    {t("noBuyerOrders")}
                    <br />

                    <Link
                        to="/marketplace"
                        className="btn btn-success mt-3"
                    >
                        {t(
                            "exploreMarketplace"
                        )}
                    </Link>
                </div>
            ) : (
                <div className="row g-4">
                    {orders.map(
                        (order) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={
                                    order._id
                                }
                            >
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-3">
                                            <h5 className="fw-bold">
                                                🌾{" "}
                                                {language === "en" ? (
                                                    order.cropName
                                                ) : (
                                                    <span>
                                                        {tCrop(order.cropName)}
                                                        {tCrop(order.cropName) !== order.cropName && (
                                                            <span className="text-muted fs-6 ms-2 fw-normal">
                                                                ({order.cropName})
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </h5>


                                            <span
                                                className={`badge ${
                                                    order.status ===
                                                    "Accepted"
                                                        ? "bg-success"
                                                        : order.status ===
                                                          "Rejected"
                                                        ? "bg-danger"
                                                        : "bg-warning text-dark"
                                                }`}
                                            >
                                                {
                                                    order.status === "Accepted"
                                                        ? t("accepted")
                                                        : order.status === "Rejected"
                                                        ? t("rejected")
                                                        : t("pending")
                                                }
                                            </span>
                                        </div>

                                        <p>
                                            <strong>
                                                {
                                                    t(
                                                        "farmer"
                                                    )
                                                }:
                                            </strong>{" "}
                                            {
                                                order.farmerName
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                {
                                                    t(
                                                        "quantity"
                                                    )
                                                }:
                                            </strong>{" "}
                                            {
                                                order.quantity
                                            }{" "}
                                            kg
                                        </p>

                                        <p>
                                            <strong>
                                                {
                                                    t(
                                                        "pricePerKg"
                                                    )
                                                }:
                                            </strong>{" "}
                                            ₹
                                            {
                                                order.pricePerKg
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                {
                                                    t(
                                                        "totalPrice"
                                                    )
                                                }:
                                            </strong>{" "}
                                            ₹
                                            {
                                                order.totalPrice
                                            }
                                        </p>

                                        <p className="text-muted small mb-0">
                                            {
                                                t(
                                                    "orderedOn"
                                                )
                                            }:{" "}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

export default BuyerDashboard;