import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

function FarmerDashboard() {
    const { t, tCrop, language } = useLanguage();


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );

    const [form, setForm] = useState({
        cropName: "",
        quantity: "",
        pricePerKg: "",
        harvestDate: "",
        state: "",
        district: "",
        villageTown: "",
        pickupPoint: ""
    });

    const [products, setProducts] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [loadingProducts, setLoadingProducts] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const fetchProducts = async () => {
        if (!user) return;

        try {
            const response =
                await axios.get(
                    "http://localhost:5000/api/products",
                    {
                        params: {
                            farmerName:
                                user.name
                        }
                    }
                );

            setProducts(response.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;

        setMessage("");
        setError("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/products/add",
                {
                    ...form,
                    farmerName: user.name
                }
            );

            setMessage(
                t("cropAdded")
            );

            setForm({
                cropName: "",
                quantity: "",
                pricePerKg: "",
                harvestDate: "",
                state: "",
                district: "",
                villageTown: "",
                pickupPoint: ""
            });

            fetchProducts();

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to add crop"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="container py-5">
                <div className="alert alert-warning text-center">
                    {t("farmerLoginMessage")}
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

    if (user.role !== "farmer") {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    {t("farmerLoginRequired")}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h2 className="page-title">
                        🚜{" "}
                        {t("farmerDashboard")}
                    </h2>

                    <p className="text-muted mb-0">
                        {t("welcomeUser")}{" "}
                        <strong>
                            {user.name}
                        </strong>
                    </p>
                </div>

                <Link
                    to="/farmer-orders"
                    className="btn btn-outline-success"
                >
                    📦 {t("manageOrders")}
                </Link>
            </div>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card shadow-sm border-0 mb-5">
                <div className="card-body p-4">
                    <h4 className="fw-bold mb-4">
                        ➕ {t("addCrop")}
                    </h4>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">
                                    {t("cropName")}
                                </label>

                                <input
                                    className="form-control"
                                    name="cropName"
                                    value={
                                        form.cropName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tomato"
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">
                                    {t("quantity")}{" "}
                                    (kg)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    name="quantity"
                                    value={
                                        form.quantity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label">
                                    {t("pricePerKg")}{" "}
                                    (₹)
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    className="form-control"
                                    name="pricePerKg"
                                    value={
                                        form.pricePerKg
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t(
                                        "harvestDate"
                                    )}
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="harvestDate"
                                    value={
                                        form.harvestDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t("state")}
                                </label>

                                <input
                                    className="form-control"
                                    name="state"
                                    value={
                                        form.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tamil Nadu"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">
                                    {t("district")}
                                </label>

                                <input
                                    className="form-control"
                                    name="district"
                                    value={
                                        form.district
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Chennai"
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    {t(
                                        "villageTown"
                                    )}
                                </label>

                                <input
                                    className="form-control"
                                    name="villageTown"
                                    value={
                                        form.villageTown
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">
                                    {t(
                                        "pickupPoint"
                                    )}
                                </label>

                                <input
                                    className="form-control"
                                    name="pickupPoint"
                                    value={
                                        form.pickupPoint
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder={t("optional")}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success mt-4"
                            disabled={loading}
                        >
                            {loading
                                ? t("processing")
                                : `🌱 ${t(
                                    "listCrop"
                                )}`}
                        </button>
                    </form>
                </div>
            </div>

            <h4 className="fw-bold mb-3">
                📋 {t("available")}
            </h4>

            {loadingProducts ? (
                <p>{t("loadingCrops")}</p>
            ) : products.length === 0 ? (
                <div className="alert alert-light border">
                    {t("noCropsFound")}
                </div>
            ) : (
                <div className="row g-4">
                    {products.map(
                        (product) => (
                            <div
                                className="col-md-6 col-lg-4"
                                key={
                                    product._id
                                }
                            >
                                <div className="card crop-card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="fw-bold">
                                                🌾{" "}
                                                {language === "en" ? (
                                                    product.cropName
                                                ) : (
                                                    <span>
                                                        {tCrop(product.cropName)}
                                                        {tCrop(product.cropName) !== product.cropName && (
                                                            <span className="text-muted fs-6 ms-2 fw-normal">
                                                                ({product.cropName})
                                                            </span>
                                                        )}
                                                    </span>
                                                )}
                                            </h5>


                                            <span className="badge bg-success">
                                                ₹
                                                {
                                                    product.pricePerKg
                                                }
                                                /kg
                                            </span>
                                        </div>

                                        <p className="mb-1">
                                            <strong>
                                                {
                                                    t(
                                                        "availableQuantity"
                                                    )
                                                }:
                                            </strong>{" "}
                                            {
                                                product.quantity
                                            }{" "}
                                            kg
                                        </p>

                                        <p className="mb-1">
                                            <strong>
                                                {
                                                    t(
                                                        "referencePrice"
                                                    )
                                                }:
                                            </strong>{" "}
                                            ₹
                                            {
                                                product.referencePrice
                                            }
                                            /kg
                                        </p>

                                        <p className="mb-1">
                                            <strong>
                                                {
                                                    t(
                                                        "priceStatus"
                                                    )
                                                }:
                                            </strong>{" "}
                                            {
                                                product.priceStatus === "Fair"
                                                    ? t("fair")
                                                    : product.priceStatus === "Below Reference"
                                                    ? t("belowReference")
                                                    : product.priceStatus === "Above Reference"
                                                    ? t("aboveReference")
                                                    : product.priceStatus
                                            }
                                        </p>

                                        <p className="text-muted small mb-0">
                                            {
                                                product.villageTown
                                            }
                                            ,{" "}
                                            {
                                                product.district
                                            }
                                            ,{" "}
                                            {
                                                product.state
                                            }
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

export default FarmerDashboard;