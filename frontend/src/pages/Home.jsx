import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Home() {
    const { t } = useLanguage();

    return (
        <div>

            {/* =========================================
                HERO SECTION
            ========================================== */}
            <section className="bg-success text-white py-5">
                <div className="container py-5">
                    <div className="row align-items-center">

                        <div className="col-lg-7">

                            <h1 className="display-4 fw-bold mb-3">
                                🌱 {t("welcome")}
                            </h1>

                            <h2 className="fw-semibold mb-3">
                                {t("connectingFarmers")}
                            </h2>

                            <p className="lead mb-4">
                                {t("platformDescription")}
                            </p>

                            <div className="d-flex gap-3 flex-wrap">

                                <Link
                                    to="/marketplace"
                                    className="btn btn-light btn-lg"
                                >
                                    🛒 {t("exploreMarketplace")}
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-outline-light btn-lg"
                                >
                                    🚜 {t("joinAgriVibe")}
                                </Link>

                            </div>

                        </div>

                        <div className="col-lg-5 text-center mt-4 mt-lg-0">

                            <div
                                className="bg-white text-success rounded-circle mx-auto d-flex align-items-center justify-content-center shadow"
                                style={{
                                    width: "250px",
                                    height: "250px",
                                    fontSize: "100px"
                                }}
                            >
                                🌾
                            </div>

                        </div>

                    </div>
                </div>
            </section>


            {/* =========================================
                DIRECT / FAIR CONNECTION
            ========================================== */}
            <section className="py-5 bg-light">
                <div className="container text-center">

                    <h2 className="fw-bold mb-2">
                        {t("simpleDirectFair")}
                    </h2>

                    <p className="text-muted mb-5">
                        {t("farmToBuyer")}
                    </p>

                    <div className="row g-4">

                        {/* Farmer */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <div className="fs-1 mb-3">
                                        👨‍🌾
                                    </div>

                                    <h4 className="fw-bold">
                                        {t("directFarmerConnection")}
                                    </h4>

                                    <p className="text-muted">
                                        {t("directFarmerDescription")}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Fair Pricing */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <div className="fs-1 mb-3">
                                        💰
                                    </div>

                                    <h4 className="fw-bold">
                                        {t("fairPricing")}
                                    </h4>

                                    <p className="text-muted">
                                        {t("fairPricingDescription")}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Bulk Orders */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body p-4">

                                    <div className="fs-1 mb-3">
                                        📦
                                    </div>

                                    <h4 className="fw-bold">
                                        {t("easyBulkOrders")}
                                    </h4>

                                    <p className="text-muted">
                                        {t("easyBulkOrdersDescription")}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* =========================================
                WHY AGRIVIBE
            ========================================== */}
            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            {t("whyChooseAgriVibe")}
                        </h2>

                        <p className="text-muted">
                            {t("platformDescription")}
                        </p>

                    </div>


                    <div className="row g-4">

                        {/* Direct Connection */}
                        <div className="col-md-4">

                            <div className="text-center p-4">

                                <div className="display-5 mb-3">
                                    🤝
                                </div>

                                <h5 className="fw-bold">
                                    {t("directFarmerConnection")}
                                </h5>

                                <p className="text-muted">
                                    {t("directFarmerDescription")}
                                </p>

                            </div>

                        </div>


                        {/* Fair Pricing */}
                        <div className="col-md-4">

                            <div className="text-center p-4">

                                <div className="display-5 mb-3">
                                    ⚖️
                                </div>

                                <h5 className="fw-bold">
                                    {t("fairPricing")}
                                </h5>

                                <p className="text-muted">
                                    {t("fairPricingDescription")}
                                </p>

                            </div>

                        </div>


                        {/* Easy Orders */}
                        <div className="col-md-4">

                            <div className="text-center p-4">

                                <div className="display-5 mb-3">
                                    🚚
                                </div>

                                <h5 className="fw-bold">
                                    {t("easyBulkOrders")}
                                </h5>

                                <p className="text-muted">
                                    {t("easyBulkOrdersDescription")}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                HOW AGRIVIBE WORKS
            ========================================== */}
            <section className="py-5 bg-light">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            {t("howAgriVibeWorks")}
                        </h2>

                    </div>


                    <div className="row g-4">

                        {/* Step 1 */}
                        <div className="col-md-3">

                            <div className="text-center">

                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "24px"
                                    }}
                                >
                                    1
                                </div>

                                <h5 className="fw-bold">
                                    {t("stepRegister")}
                                </h5>

                                <p className="text-muted">
                                    {t("stepRegisterDescription")}
                                </p>

                            </div>

                        </div>


                        {/* Step 2 */}
                        <div className="col-md-3">

                            <div className="text-center">

                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "24px"
                                    }}
                                >
                                    2
                                </div>

                                <h5 className="fw-bold">
                                    {t("stepListCrops")}
                                </h5>

                                <p className="text-muted">
                                    {t("stepListCropsDescription")}
                                </p>

                            </div>

                        </div>


                        {/* Step 3 */}
                        <div className="col-md-3">

                            <div className="text-center">

                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "24px"
                                    }}
                                >
                                    3
                                </div>

                                <h5 className="fw-bold">
                                    {t("stepDiscover")}
                                </h5>

                                <p className="text-muted">
                                    {t("stepDiscoverDescription")}
                                </p>

                            </div>

                        </div>


                        {/* Step 4 */}
                        <div className="col-md-3">

                            <div className="text-center">

                                <div
                                    className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        fontSize: "24px"
                                    }}
                                >
                                    4
                                </div>

                                <h5 className="fw-bold">
                                    {t("stepConnect")}
                                </h5>

                                <p className="text-muted">
                                    {t("stepConnectDescription")}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                CALL TO ACTION
            ========================================== */}
            <section className="py-5 bg-success text-white">

                <div className="container text-center">

                    <h2 className="fw-bold mb-3">
                        {t("readyToStart")}
                    </h2>

                    <p className="lead mb-4">
                        {t("joinMarketplace")}
                    </p>

                    <Link
                        to="/register"
                        className="btn btn-light btn-lg"
                    >
                        🚀 {t("getStarted")}
                    </Link>

                </div>

            </section>


            {/* =========================================
                FOOTER
            ========================================== */}
            <footer className="bg-dark text-white py-4">

                <div className="container text-center">

                    <h5 className="fw-bold">
                        🌱 {t("appName")}
                    </h5>

                    <p className="mb-0 text-secondary">
                        {t("tagline")}
                    </p>

                </div>

            </footer>

        </div>
    );
}

export default Home;