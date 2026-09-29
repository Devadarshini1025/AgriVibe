import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";

function Login() {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const cleanEmail = email.trim();

        if (!cleanEmail || !password) {
            setError(
                t("loginFailed") ||
                    "Please enter your email and password."
            );

            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/users/login",
                {
                    email: cleanEmail,
                    password
                }
            );

            /* ---------------- SAVE LOGIN DATA ---------------- */

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    response.data.user
                )
            );

            /* ---------------- ROLE REDIRECTION ---------------- */

            const role =
                response.data.user?.role;

            if (role === "farmer") {
                navigate(
                    "/farmer-dashboard"
                );
            } else if (role === "buyer") {
                navigate(
                    "/buyer-dashboard"
                );
            } else {
                setError(
                    t("loginFailed") ||
                        "Invalid user role."
                );
            }

        } catch (err) {
            console.error(
                "Login Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t("loginFailed") ||
                    "Login failed. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-6 col-lg-5">

                    <div className="card shadow-sm border-0">

                        <div className="card-body p-4">

                            {/* ---------------- HEADER ---------------- */}

                            <div className="text-center mb-4">

                                <div className="fs-1">
                                    🌱
                                </div>

                                <h2 className="fw-bold">
                                    {t("login")}
                                </h2>

                                <p className="text-muted mb-0">
                                    {t("welcome")}
                                </p>

                            </div>

                            {/* ---------------- ERROR ---------------- */}

                            {error && (
                                <div
                                    className="alert alert-danger"
                                    role="alert"
                                >
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* ---------------- LOGIN FORM ---------------- */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label
                                        className="form-label fw-semibold"
                                        htmlFor="loginEmail"
                                    >
                                        {t("email")}
                                    </label>

                                    <input
                                        id="loginEmail"
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        placeholder={t(
                                            "enterEmail"
                                        )}
                                        autoComplete="email"
                                        required
                                        disabled={loading}
                                    />

                                </div>

                                {/* PASSWORD */}

                                <div className="mb-4">

                                    <label
                                        className="form-label fw-semibold"
                                        htmlFor="loginPassword"
                                    >
                                        {t("password")}
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="loginPassword"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control"
                                            value={
                                                password
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setPassword(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            placeholder={t(
                                                "enterPassword"
                                            )}
                                            autoComplete="current-password"
                                            required
                                            disabled={
                                                loading
                                            }
                                        />

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >
                                            {showPassword
                                                ? "🙈"
                                                : "👁️"}
                                        </button>

                                    </div>

                                </div>

                                {/* LOGIN BUTTON */}

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            />

                                            {t(
                                                "processing"
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            🔐{" "}
                                            {t(
                                                "login"
                                            )}
                                        </>
                                    )}
                                </button>

                            </form>

                            {/* ---------------- REGISTER LINK ---------------- */}

                            <div className="text-center mt-4">

                                <span className="text-muted">
                                    {t(
                                        "noAccount"
                                    )}{" "}
                                </span>

                                <Link
                                    to="/register"
                                    className="fw-semibold"
                                >
                                    {t("register")}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;