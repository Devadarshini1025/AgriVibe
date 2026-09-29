import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useLanguage } from "../context/LanguageContext";

function Register() {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        const cleanName =
            form.name.trim();

        const cleanEmail =
            form.email.trim();

        const cleanPassword =
            form.password;

        /* ---------------- VALIDATION ---------------- */

        if (!cleanName) {
            setError(
                t("enterName") ||
                    "Please enter your name."
            );

            return;
        }

        if (!cleanEmail) {
            setError(
                t("enterEmail") ||
                    "Please enter your email."
            );

            return;
        }

        if (cleanPassword.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );

            return;
        }

        if (!form.role) {
            setError(
                t("selectRole") ||
                    "Please select your role."
            );

            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/api/users/register",
                {
                    name: cleanName,
                    email: cleanEmail,
                    password: cleanPassword,
                    role: form.role
                }
            );

            /*
             * Registration completed successfully.
             * Move the user to Login instead of
             * automatically logging them in.
             */

            alert(
                t(
                    "registrationSuccessful"
                )
            );

            navigate("/login");

        } catch (err) {
            console.error(
                "Registration Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                    t(
                        "registrationFailed"
                    ) ||
                    "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">

            <div className="row justify-content-center">

                <div className="col-md-7 col-lg-6">

                    <div className="card shadow-sm border-0">

                        <div className="card-body p-4">

                            {/* ---------------- HEADER ---------------- */}

                            <div className="text-center mb-4">

                                <div className="fs-1">
                                    🚜
                                </div>

                                <h2 className="fw-bold">
                                    {t("register")}
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

                            {/* ---------------- FORM ---------------- */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >

                                {/* NAME */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="registerName"
                                        className="form-label fw-semibold"
                                    >
                                        {t("name")}
                                    </label>

                                    <input
                                        id="registerName"
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={
                                            form.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "enterName"
                                        )}
                                        autoComplete="name"
                                        required
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>

                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="registerEmail"
                                        className="form-label fw-semibold"
                                    >
                                        {t("email")}
                                    </label>

                                    <input
                                        id="registerEmail"
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder={t(
                                            "enterEmail"
                                        )}
                                        autoComplete="email"
                                        required
                                        disabled={
                                            loading
                                        }
                                    />

                                </div>

                                {/* PASSWORD */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="registerPassword"
                                        className="form-label fw-semibold"
                                    >
                                        {t("password")}
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="registerPassword"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            className="form-control"
                                            value={
                                                form.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder={t(
                                                "enterPassword"
                                            )}
                                            autoComplete="new-password"
                                            minLength="6"
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

                                    <small className="text-muted">
                                        Password must contain
                                        at least 6 characters.
                                    </small>

                                </div>

                                {/* ROLE */}

                                <div className="mb-4">

                                    <label
                                        htmlFor="registerRole"
                                        className="form-label fw-semibold"
                                    >
                                        {t("role")}
                                    </label>

                                    <select
                                        id="registerRole"
                                        name="role"
                                        className="form-select"
                                        value={
                                            form.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        disabled={
                                            loading
                                        }
                                    >

                                        <option value="">
                                            {t(
                                                "selectRole"
                                            )}
                                        </option>

                                        <option value="farmer">
                                            👨‍🌾{" "}
                                            {t(
                                                "farmer"
                                            )}
                                        </option>

                                        <option value="buyer">
                                            🛒{" "}
                                            {t(
                                                "buyer"
                                            )}
                                        </option>

                                    </select>

                                </div>

                                {/* REGISTER BUTTON */}

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={
                                        loading
                                    }
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
                                            🚀{" "}
                                            {t(
                                                "register"
                                            )}
                                        </>
                                    )}

                                </button>

                            </form>

                            {/* ---------------- LOGIN LINK ---------------- */}

                            <div className="text-center mt-4">

                                <span className="text-muted">
                                    {t(
                                        "alreadyAccount"
                                    )}{" "}
                                </span>

                                <Link
                                    to="/login"
                                    className="fw-semibold"
                                >
                                    {t("login")}
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;