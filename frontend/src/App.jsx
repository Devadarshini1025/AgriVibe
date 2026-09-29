import {
    Link,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import FarmerOrders from "./pages/FarmerOrders";
import Marketplace from "./pages/Marketplace";
import BuyerDashboard from "./pages/BuyerDashboard";
import ImpactDashboard from "./pages/ImpactDashboard";
import CropAdvisory from "./pages/CropAdvisory";
import WeatherInsights from "./pages/WeatherInsights";
import Payment from "./pages/Payment";

import LanguageSelector from "./components/LanguageSelector";

import { useLanguage } from "./context/LanguageContext";

import "bootstrap/dist/js/bootstrap.bundle.min.js";


/* =========================================================
   GET CURRENT USER
========================================================= */

function getCurrentUser() {
    try {
        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        return JSON.parse(savedUser);

    } catch (error) {
        console.error(
            "Unable to read user:",
            error
        );

        return null;
    }
}


/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
    children,
    role
}) {
    const user =
        getCurrentUser();


    /* =====================================================
       USER NOT LOGGED IN
    ===================================================== */

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /* =====================================================
       WRONG ROLE
    ===================================================== */

    if (
        role &&
        user.role !== role
    ) {

        if (
            user.role ===
            "farmer"
        ) {
            return (
                <Navigate
                    to="/farmer-dashboard"
                    replace
                />
            );
        }


        if (
            user.role ===
            "buyer"
        ) {
            return (
                <Navigate
                    to="/buyer-dashboard"
                    replace
                />
            );
        }


        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return children;
}


/* =========================================================
   APP
========================================================= */

function App() {

    const { t } =
        useLanguage();

    const navigate =
        useNavigate();


    /* =====================================================
       CURRENT USER
    ===================================================== */

    const user =
        getCurrentUser();


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        navigate("/");

        window.location.reload();
    };


    return (
        <>
            {/* =================================================
                NAVBAR
            ================================================= */}

            <nav className="navbar navbar-expand-lg navbar-dark bg-success">

                <div className="container">

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <Link
                        className="navbar-brand fw-bold"
                        to="/"
                    >
                        🌱{" "}
                        {t("appName")}
                    </Link>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================= */}

                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>


                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

                    <div
                        className="collapse navbar-collapse"
                        id="navbarNav"
                    >

                        <ul className="navbar-nav ms-auto align-items-lg-center">


                            {/* =================================================
                                HOME - EVERYONE
                            ================================================= */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/"
                                >
                                    {t("home")}
                                </Link>

                            </li>


                            {/* =================================================
                                MARKETPLACE - EVERYONE
                            ================================================= */}

                            <li className="nav-item">

                                <Link
                                    className="nav-link"
                                    to="/marketplace"
                                >
                                    🛒{" "}
                                    {t("marketplace")}
                                </Link>

                            </li>


                            {/* =================================================
                                FARMER MENU
                            ================================================= */}

                            {user?.role ===
                                "farmer" && (
                                <>

                                    {/* FARMER DASHBOARD */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/farmer-dashboard"
                                        >
                                            🌾{" "}
                                            {t(
                                                "farmerDashboard"
                                            )}
                                        </Link>

                                    </li>


                                    {/* FARMER ORDERS */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/farmer-orders"
                                        >
                                            📦{" "}
                                            {t(
                                                "farmerOrders"
                                            )}
                                        </Link>

                                    </li>


                                    {/* CROP ADVISORY */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/crop-advisory"
                                        >
                                            🤖{" "}
                                            {t(
                                                "cropAdvisory"
                                            )}
                                        </Link>

                                    </li>


                                    {/* WEATHER */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/weather"
                                        >
                                            🌦️{" "}
                                            {t(
                                                "weatherInsights"
                                            )}
                                        </Link>

                                    </li>

                                </>
                            )}


                            {/* =================================================
                                BUYER MENU
                            ================================================= */}

                            {user?.role ===
                                "buyer" && (

                                <li className="nav-item">

                                    <Link
                                        className="nav-link"
                                        to="/buyer-dashboard"
                                    >
                                        🛒{" "}
                                        {t(
                                            "myOrders"
                                        )}
                                    </Link>

                                </li>

                            )}


                            {/* =================================================
                                IMPACT DASHBOARD
                                AVAILABLE AFTER LOGIN
                            ================================================= */}

                            {user && (

                                <li className="nav-item">

                                    <Link
                                        className="nav-link"
                                        to="/impact-dashboard"
                                    >
                                        📊{" "}
                                        {t(
                                            "impactDashboard"
                                        )}
                                    </Link>

                                </li>

                            )}


                            {/* =================================================
                                LOGIN + REGISTER
                                LOGGED OUT ONLY
                            ================================================= */}

                            {!user && (
                                <>

                                    {/* LOGIN */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/login"
                                        >
                                            {t(
                                                "login"
                                            )}
                                        </Link>

                                    </li>


                                    {/* REGISTER */}

                                    <li className="nav-item">

                                        <Link
                                            className="nav-link"
                                            to="/register"
                                        >
                                            {t(
                                                "register"
                                            )}
                                        </Link>

                                    </li>

                                </>
                            )}


                            {/* =================================================
                                LOGGED-IN USER
                            ================================================= */}

                            {user && (
                                <>

                                    {/* USER NAME */}

                                    <li className="nav-item">

                                        <span className="nav-link">

                                            👤{" "}

                                            <strong>
                                                {
                                                    user.name
                                                }
                                            </strong>

                                        </span>

                                    </li>


                                    {/* LOGOUT */}

                                    <li className="nav-item">

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-light ms-lg-2"
                                            onClick={
                                                logout
                                            }
                                        >
                                            {t(
                                                "logout"
                                            )}
                                        </button>

                                    </li>

                                </>
                            )}


                            {/* =================================================
                                LANGUAGE SELECTOR
                            ================================================= */}

                            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">

                                <LanguageSelector />

                            </li>

                        </ul>

                    </div>

                </div>

            </nav>


            {/* =========================================================
                ROUTES
            ========================================================= */}

            <Routes>

                {/* =================================================
                    PUBLIC ROUTES
                ================================================= */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                <Route
                    path="/marketplace"
                    element={
                        <Marketplace />
                    }
                />


                {/* =================================================
                    IMPACT DASHBOARD
                ================================================= */}

                <Route
                    path="/impact-dashboard"
                    element={
                        <ProtectedRoute>
                            <ImpactDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    FARMER DASHBOARD
                ================================================= */}

                <Route
                    path="/farmer-dashboard"
                    element={
                        <ProtectedRoute
                            role="farmer"
                        >
                            <FarmerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    FARMER ORDERS
                ================================================= */}

                <Route
                    path="/farmer-orders"
                    element={
                        <ProtectedRoute
                            role="farmer"
                        >
                            <FarmerOrders />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    CROP ADVISORY
                ================================================= */}

                <Route
                    path="/crop-advisory"
                    element={
                        <ProtectedRoute
                            role="farmer"
                        >
                            <CropAdvisory />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    WEATHER INSIGHTS
                ================================================= */}

                <Route
                    path="/weather"
                    element={
                        <ProtectedRoute
                            role="farmer"
                        >
                            <WeatherInsights />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    BUYER DASHBOARD
                ================================================= */}

                <Route
                    path="/buyer-dashboard"
                    element={
                        <ProtectedRoute
                            role="buyer"
                        >
                            <BuyerDashboard />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    AGRIVIBE DEMO PAYMENT
                ================================================= */}

                <Route
                    path="/payment/:orderId"
                    element={
                        <ProtectedRoute
                            role="buyer"
                        >
                            <Payment />
                        </ProtectedRoute>
                    }
                />


                {/* =================================================
                    UNKNOWN ROUTE
                ================================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}


export default App;