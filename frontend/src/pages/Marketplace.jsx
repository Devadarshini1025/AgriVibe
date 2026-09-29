import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

const Marketplace = () => {
    const {
        t,
        tCrop,
        language
    } = useLanguage();

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [orderQuantity, setOrderQuantity] =
        useState("");

    const [loading, setLoading] = useState(false);

    const [locationMethod, setLocationMethod] =
        useState("manual");

    const [deliveryLocation, setDeliveryLocation] =
        useState({
            address: "",
            city: "",
            state: "",
            pincode: "",
            latitude: null,
            longitude: null,
            method: "manual"
        });

    const [locationLoading, setLocationLoading] =
        useState(false);

    const [message, setMessage] = useState("");

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || null;


    /*
     * ==========================================
     * GET PRODUCTS
     * ==========================================
     */

    const fetchProducts = async () => {
        try {
            const response =
                await axios.get(
                    "http://localhost:5000/api/products"
                );

            setProducts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {
            console.error(
                "Error fetching products:",
                error
            );

            setMessage(
                "Unable to load marketplace"
            );
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);


    /*
     * ==========================================
     * SEARCH
     * ==========================================
     */

    const filteredProducts =
        products.filter((product) => {
            const searchText =
                search.toLowerCase();

            return (
                product.cropName
                    ?.toLowerCase()
                    .includes(searchText) ||

                product.state
                    ?.toLowerCase()
                    .includes(searchText) ||

                product.district
                    ?.toLowerCase()
                    .includes(searchText) ||

                product.villageTown
                    ?.toLowerCase()
                    .includes(searchText) ||

                product.pickupPoint
                    ?.toLowerCase()
                    .includes(searchText) ||

                product.location
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });


    /*
     * ==========================================
     * LOCATION DISPLAY
     * ==========================================
     */

    const getLocation = (product) => {
        const parts = [
            product.villageTown,
            product.district,
            product.state
        ].filter(Boolean);

        if (parts.length > 0) {
            return parts.join(", ");
        }

        return (
            product.location ||
            "Location not provided"
        );
    };


    /*
     * ==========================================
     * SELECT PRODUCT
     * ==========================================
     */

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);

        setOrderQuantity("");

        setMessage("");

        setLocationMethod("manual");

        setDeliveryLocation({
            address: "",
            city: "",
            state: "",
            pincode: "",
            latitude: null,
            longitude: null,
            method: "manual"
        });

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    };


    /*
     * ==========================================
     * DELIVERY LOCATION INPUT
     * ==========================================
     */

    const handleLocationChange = (event) => {
        const {
            name,
            value
        } = event.target;

        setDeliveryLocation(
            (previous) => ({
                ...previous,
                [name]: value,
                method: "manual"
            })
        );
    };


    /*
     * ==========================================
     * USE CURRENT LOCATION
     * ==========================================
     */

    const useCurrentLocation = () => {
        if (!navigator.geolocation) {
            setMessage(
                "Current location is not supported by your browser."
            );

            return;
        }

        setLocationLoading(true);

        setMessage(
            "Getting your current location..."
        );

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                setLocationMethod("current");

                setDeliveryLocation(
                    (previous) => ({
                        ...previous,
                        latitude,
                        longitude,
                        method: "current"
                    })
                );

                setLocationLoading(false);

                setMessage(
                    "Current location captured. Please enter your address, city, state and pincode."
                );
            },

            (error) => {
                console.error(
                    "Location Error:",
                    error
                );

                setLocationLoading(false);

                setMessage(
                    "Unable to get your current location. Please allow location permission or enter the address manually."
                );

                setLocationMethod(
                    "manual"
                );
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };


    /*
     * ==========================================
     * PLACE ORDER
     * ==========================================
     */

    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        setMessage("");

        if (!user) {
            setMessage(
                "Please login before placing an order."
            );

            return;
        }

        if (user.role !== "buyer") {
            setMessage(
                t("onlyBuyers")
            );

            return;
        }

        if (!selectedProduct) {
            setMessage(
                "Please select a crop."
            );

            return;
        }

        const quantity =
            Number(orderQuantity);

        if (
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {
            setMessage(
                t("enterValidQuantity")
            );

            return;
        }

        if (
            quantity >
            Number(selectedProduct.quantity)
        ) {
            setMessage(
                t("insufficientQuantity")
            );

            return;
        }

        if (
            !deliveryLocation.address.trim() ||
            !deliveryLocation.city.trim() ||
            !deliveryLocation.state.trim() ||
            !deliveryLocation.pincode.trim()
        ) {
            setMessage(
                "Please enter your complete delivery address."
            );

            return;
        }

        if (
            !/^[0-9]{6}$/.test(
                deliveryLocation.pincode.trim()
            )
        ) {
            setMessage(
                "Please enter a valid 6-digit pincode."
            );

            return;
        }

        try {
            setLoading(true);

            const response =
                await axios.post(
                    "http://localhost:5000/api/orders/add",
                    {
                        productId:
                            selectedProduct._id,

                        buyerName:
                            user.name,

                        buyerEmail:
                            user.email,

                        quantity,

                        deliveryLocation: {
                            address:
                                deliveryLocation.address.trim(),

                            city:
                                deliveryLocation.city.trim(),

                            state:
                                deliveryLocation.state.trim(),

                            pincode:
                                deliveryLocation.pincode.trim(),

                            latitude:
                                deliveryLocation.latitude,

                            longitude:
                                deliveryLocation.longitude,

                            method:
                                locationMethod
                        }
                    }
                );


            /*
             * ==========================================
             * GET THE REAL CREATED ORDER ID
             * ==========================================
             *
             * Backend may return the order in:
             * response.data.order._id
             *
             * The additional fallbacks make this
             * compatible with slightly different
             * response formats.
             */

            const createdOrder =
                response.data?.order ||
                response.data?.data ||
                null;

            const orderId =
                createdOrder?._id ||
                createdOrder?.id ||
                response.data?.orderId ||
                response.data?._id ||
                response.data?.id;


            /*
             * ==========================================
             * PAYMENT REDIRECT
             * ==========================================
             */

            if (orderId) {

                setMessage(
                    "Order created successfully. Redirecting to payment..."
                );

                /*
                 * Give the browser a tiny moment to
                 * display the success message before
                 * moving to the payment page.
                 */

                setTimeout(() => {
                    navigate(
                        `/payment/${orderId}`
                    );
                }, 300);

                return;
            }


            /*
             * ==========================================
             * ORDER CREATED BUT ID NOT RETURNED
             * ==========================================
             */

            console.error(
                "Order created but no order ID was returned:",
                response.data
            );

            setMessage(
                "Order was created, but the payment page could not be opened. Please check your orders."
            );

            setSelectedProduct(null);

            setOrderQuantity("");

            setDeliveryLocation({
                address: "",
                city: "",
                state: "",
                pincode: "",
                latitude: null,
                longitude: null,
                method: "manual"
            });

            setLocationMethod("manual");

            await fetchProducts();

        } catch (error) {
            console.error(
                "Place Order Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to place order. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    /*
     * ==========================================
     * TOTAL PRICE
     * ==========================================
     */

    const totalPrice =
        selectedProduct &&
        orderQuantity
            ? Number(orderQuantity) *
              Number(
                  selectedProduct.pricePerKg
              )
            : 0;


    /*
     * ==========================================
     * PRICE STATUS TRANSLATION
     * ==========================================
     */

    const getPriceStatus = (status) => {
        if (status === "Fair") {
            return t("fair");
        }

        if (status === "Below Reference") {
            return t("belowReference");
        }

        if (status === "Above Reference") {
            return t("aboveReference");
        }

        return status;
    };


    return (
        <div
            className="container py-4"
            style={{
                minHeight: "100vh"
            }}
        >

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="text-center mb-4">

                <h1 className="fw-bold">
                    {t("marketplace")}
                </h1>

                <p className="text-muted">
                    {t("discoverFreshCrops")}
                </p>

            </div>


            {/* =====================================
                SEARCH
            ===================================== */}

            <div className="row justify-content-center mb-4">

                <div className="col-md-8">

                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder={
                            t("searchCrops")
                        }
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

            </div>


            {/* =====================================
                MESSAGE
            ===================================== */}

            {message && (
                <div
                    className="alert alert-info text-center"
                    role="alert"
                >
                    {message}
                </div>
            )}


            {/* =====================================
                PRODUCT GRID
            ===================================== */}

            <div className="row g-4">

                {filteredProducts.length === 0 ? (

                    <div className="col-12">

                        <div className="text-center py-5">

                            <h4>
                                {t("noCropsFound")}
                            </h4>

                            <p className="text-muted">
                                {t("tryAnotherCrop")}
                            </p>

                        </div>

                    </div>

                ) : (

                    filteredProducts.map(
                        (product) => (

                            <div
                                className="col-md-6 col-lg-4"
                                key={product._id}
                            >

                                <div
                                    className="card h-100 shadow-sm"
                                >

                                    <div className="card-body">

                                        {/* Crop */}

                                        <h4 className="card-title fw-bold">

                                            {tCrop(
                                                product.cropName
                                            )}

                                        </h4>


                                        {/* Farmer */}

                                        <p className="mb-2">

                                            <strong>
                                                {t("farmerName")}:
                                            </strong>{" "}

                                            {product.farmerName}

                                        </p>


                                        {/* Location */}

                                        <p className="mb-2">

                                            <strong>
                                                📍 {t("location")}:
                                            </strong>{" "}

                                            {getLocation(
                                                product
                                            )}

                                        </p>


                                        {/* Available Quantity */}

                                        <p className="mb-2">

                                            <strong>
                                                {t("availableQuantity")}:
                                            </strong>{" "}

                                            {product.quantity} kg

                                        </p>


                                        {/* Price */}

                                        <p className="mb-2">

                                            <strong>
                                                {t("price")}:
                                            </strong>{" "}

                                            ₹
                                            {product.pricePerKg}
                                            /kg

                                        </p>


                                        {/* Reference Price */}

                                        <p className="mb-2">

                                            <strong>
                                                {t("referencePrice")}:
                                            </strong>{" "}

                                            ₹
                                            {product.referencePrice}
                                            /kg

                                        </p>


                                        {/* Price Status */}

                                        <p className="mb-2">

                                            <strong>
                                                {t("priceStatus")}:
                                            </strong>{" "}

                                            <span
                                                className={
                                                    product.priceStatus ===
                                                    "Fair"
                                                        ? "text-success"
                                                        : product.priceStatus ===
                                                          "Below Reference"
                                                        ? "text-primary"
                                                        : "text-warning"
                                                }
                                            >
                                                {
                                                    getPriceStatus(
                                                        product.priceStatus
                                                    )
                                                }
                                            </span>

                                        </p>


                                        {/* Farmer Benefit */}

                                        {product.farmerBenefit !==
                                            undefined && (

                                            <p className="mb-2">

                                                <strong>
                                                    {t("farmerBenefit")}:
                                                </strong>{" "}

                                                {Number(
                                                    product.farmerBenefit
                                                ).toFixed(1)}
                                                %

                                            </p>
                                        )}


                                        {/* Consumer Saving */}

                                        {product.consumerSaving !==
                                            undefined && (

                                            <p className="mb-3">

                                                <strong>
                                                    {t("consumerSaving")}:
                                                </strong>{" "}

                                                {Number(
                                                    product.consumerSaving
                                                ).toFixed(1)}
                                                %

                                            </p>
                                        )}


                                        {/* Order Button */}

                                        <button
                                            className="btn btn-success w-100"
                                            onClick={() =>
                                                handleSelectProduct(
                                                    product
                                                )
                                            }
                                            disabled={
                                                Number(
                                                    product.quantity
                                                ) <= 0
                                            }
                                        >
                                            {t("placeBulkOrder")}
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>


            {/* =====================================
                ORDER SECTION
            ===================================== */}

            {selectedProduct && (

                <div
                    className="row justify-content-center mt-5"
                >

                    <div className="col-lg-8">

                        <div className="card shadow">

                            <div className="card-body p-4">

                                <h3 className="fw-bold mb-3">
                                    {t("placeBulkOrder")}
                                </h3>


                                {/* Selected Crop */}

                                <div
                                    className="alert alert-light border"
                                >

                                    <strong>
                                        {t("cropName")}:
                                    </strong>{" "}

                                    {tCrop(
                                        selectedProduct.cropName
                                    )}

                                    <br />

                                    <strong>
                                        {t("farmerName")}:
                                    </strong>{" "}

                                    {selectedProduct.farmerName}

                                    <br />

                                    <strong>
                                        {t("price")}:
                                    </strong>{" "}

                                    ₹
                                    {
                                        selectedProduct.pricePerKg
                                    }
                                    /kg

                                    <br />

                                    <strong>
                                        {t("availableQuantity")}:
                                    </strong>{" "}

                                    {
                                        selectedProduct.quantity
                                    }{" "}
                                    kg

                                </div>


                                {/* Quantity */}

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">

                                        {t("requiredQuantity")}{" "}
                                        (kg)

                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max={
                                            selectedProduct.quantity
                                        }
                                        value={
                                            orderQuantity
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setOrderQuantity(
                                                event.target.value
                                            )
                                        }
                                        placeholder={
                                            language === "en"
                                                ? "Enter quantity"
                                                : t("requiredQuantity")
                                        }
                                    />

                                </div>


                                {/* =================================
                                    DELIVERY LOCATION
                                ================================= */}

                                <div className="mt-4">

                                    <h5 className="fw-bold mb-3">

                                        📍 {t("location")}

                                    </h5>


                                    {/* Location Method */}

                                    <div className="d-flex gap-2 mb-3">

                                        <button
                                            type="button"
                                            className={
                                                locationMethod ===
                                                "manual"
                                                    ? "btn btn-success"
                                                    : "btn btn-outline-success"
                                            }
                                            onClick={() => {

                                                setLocationMethod(
                                                    "manual"
                                                );

                                                setDeliveryLocation(
                                                    (
                                                        previous
                                                    ) => ({
                                                        ...previous,
                                                        method: "manual"
                                                    })
                                                );

                                            }}
                                        >
                                            {language === "en"
                                                ? "Enter Manually"
                                                : t("location")}
                                        </button>


                                        <button
                                            type="button"
                                            className={
                                                locationMethod ===
                                                "current"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={
                                                useCurrentLocation
                                            }
                                            disabled={
                                                locationLoading
                                            }
                                        >

                                            {locationLoading
                                                ? "Getting Location..."
                                                : `📍 ${t("location")}`}

                                        </button>

                                    </div>


                                    {/* Address */}

                                    <div className="mb-3">

                                        <label className="form-label">

                                            {language === "en"
                                                ? "Delivery Address"
                                                : t("location")}

                                        </label>

                                        <textarea
                                            className="form-control"
                                            name="address"
                                            rows="3"
                                            value={
                                                deliveryLocation.address
                                            }
                                            onChange={
                                                handleLocationChange
                                            }
                                            placeholder={
                                                language === "en"
                                                    ? "Enter house number, street, area..."
                                                    : t("location")
                                            }
                                        />

                                    </div>


                                    {/* City */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            {t("city")}
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            value={
                                                deliveryLocation.city
                                            }
                                            onChange={
                                                handleLocationChange
                                            }
                                            placeholder={
                                                language === "en"
                                                    ? "Enter city or town"
                                                    : t("city")
                                            }
                                        />

                                    </div>


                                    {/* State */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            {t("state")}
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="state"
                                            value={
                                                deliveryLocation.state
                                            }
                                            onChange={
                                                handleLocationChange
                                            }
                                            placeholder={
                                                language === "en"
                                                    ? "Enter state"
                                                    : t("state")
                                            }
                                        />

                                    </div>


                                    {/* Pincode */}

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            className="form-control"
                                            name="pincode"
                                            maxLength="6"
                                            value={
                                                deliveryLocation.pincode
                                            }
                                            onChange={
                                                handleLocationChange
                                            }
                                            placeholder={
                                                language === "en"
                                                    ? "Enter 6-digit pincode"
                                                    : "6"
                                            }
                                        />

                                    </div>


                                    {/* Current Coordinates */}

                                    {deliveryLocation.latitude !==
                                        null &&
                                        deliveryLocation.longitude !==
                                            null && (

                                            <div
                                                className="alert alert-success"
                                            >

                                                <strong>
                                                    {language === "en"
                                                        ? "Current location captured"
                                                        : t("location")}
                                                </strong>

                                                <br />

                                                Latitude:{" "}
                                                {
                                                    deliveryLocation.latitude
                                                }

                                                <br />

                                                Longitude:{" "}
                                                {
                                                    deliveryLocation.longitude
                                                }

                                            </div>
                                        )}

                                </div>


                                {/* Total */}

                                {totalPrice > 0 && (

                                    <div
                                        className="alert alert-success mt-4"
                                    >

                                        <h5 className="mb-0">

                                            {t("totalPrice")}: ₹
                                            {totalPrice.toLocaleString(
                                                "en-IN"
                                            )}

                                        </h5>

                                    </div>

                                )}


                                {/* Buttons */}

                                <div className="d-flex gap-2 mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {

                                            setSelectedProduct(
                                                null
                                            );

                                            setMessage("");

                                        }}
                                    >
                                        {t("cancel")}
                                    </button>


                                    <button
                                        type="button"
                                        className="btn btn-success flex-grow-1"
                                        onClick={
                                            handlePlaceOrder
                                        }
                                        disabled={loading}
                                    >

                                        {loading
                                            ? t("loading")
                                            : t("confirmOrder")}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Marketplace;