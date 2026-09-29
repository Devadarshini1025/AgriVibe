import { useState } from "react";

import { useLanguage } from "../context/LanguageContext";

function WeatherInsights() {
    const { t } = useLanguage();

    const [location, setLocation] = useState("");

    const [weather, setWeather] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    // Get weather icon based on Open-Meteo weather code
    const getWeatherIcon = (weatherCode) => {
        if (weatherCode === 0) {
            return "☀️";
        }

        if (
            weatherCode === 1 ||
            weatherCode === 2
        ) {
            return "🌤️";
        }

        if (weatherCode === 3) {
            return "☁️";
        }

        if (
            weatherCode === 45 ||
            weatherCode === 48
        ) {
            return "🌫️";
        }

        if (
            weatherCode >= 51 &&
            weatherCode <= 67
        ) {
            return "🌧️";
        }

        if (
            weatherCode >= 71 &&
            weatherCode <= 77
        ) {
            return "❄️";
        }

        if (
            weatherCode >= 80 &&
            weatherCode <= 82
        ) {
            return "🌦️";
        }

        if (
            weatherCode >= 95 &&
            weatherCode <= 99
        ) {
            return "⛈️";
        }

        return "🌤️";
    };

    const searchWeather = async (e) => {
        e.preventDefault();

        if (!location.trim()) {
            setError(
                t("locationPlaceholder") ||
                    "Please enter a city or village"
            );

            return;
        }

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            // STEP 1: Find location coordinates
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    location.trim()
                )}&count=1&language=en&format=json`
            );

            if (!geoResponse.ok) {
                throw new Error(
                    "Unable to find location"
                );
            }

            const geoData =
                await geoResponse.json();

            if (
                !geoData.results ||
                geoData.results.length === 0
            ) {
                throw new Error(
                    "Location not found"
                );
            }

            const place =
                geoData.results[0];

            // STEP 2: Get current weather
            const weatherResponse =
                await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&timezone=auto`
                );

            if (!weatherResponse.ok) {
                throw new Error(
                    "Unable to fetch weather"
                );
            }

            const weatherData =
                await weatherResponse.json();

            if (!weatherData.current) {
                throw new Error(
                    "Weather information unavailable"
                );
            }

            setWeather({
                location:
                    place.name,

                country:
                    place.country,

                temperature:
                    weatherData.current
                        .temperature_2m,

                humidity:
                    weatherData.current
                        .relative_humidity_2m,

                precipitation:
                    weatherData.current
                        .precipitation,

                windSpeed:
                    weatherData.current
                        .wind_speed_10m,

                weatherCode:
                    weatherData.current
                        .weather_code,

                time:
                    weatherData.current
                        .time
            });
        } catch (err) {
            console.error(
                "Weather Error:",
                err
            );

            setError(
                err.message ||
                    "Unable to fetch weather"
            );
        } finally {
            setLoading(false);
        }
    };

    // Generate farming insight
    const getInsight = () => {
        if (!weather) {
            return "";
        }

        if (weather.windSpeed >= 30) {
            return t("strongWind");
        }

        if (weather.precipitation > 5) {
            return t("highRain");
        }

        if (weather.temperature >= 35) {
            return t("highTemperature");
        }

        if (weather.temperature <= 15) {
            return t("lowTemperature");
        }

        if (weather.humidity >= 85) {
            return t("highHumidity");
        }

        if (weather.humidity <= 30) {
            return t("lowHumidity");
        }

        if (weather.precipitation === 0) {
            return t("noRain");
        }

        return t("goodConditions");
    };

    return (
        <div className="container py-5">

            {/* PAGE HEADER */}
            <div className="text-center mb-5">

                <h2 className="page-title">
                    🌦️{" "}
                    {t("weatherInformation")}
                </h2>

                <p className="text-muted">
                    {t("weatherDescription")}
                </p>

            </div>

            <div className="row justify-content-center">

                <div className="col-lg-9">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            {/* SEARCH FORM */}
                            <form
                                onSubmit={
                                    searchWeather
                                }
                                className="row g-2"
                            >

                                <div className="col-md-9">

                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(
                                                e.target.value
                                            )
                                        }
                                        placeholder={t(
                                            "locationPlaceholder"
                                        )}
                                    />

                                </div>

                                <div className="col-md-3">

                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100"
                                        disabled={
                                            loading
                                        }
                                    >
                                        {loading
                                            ? `⏳ ${t(
                                                  "loading"
                                              )}`
                                            : `🌦️ ${t(
                                                  "searchWeather"
                                              )}`}
                                    </button>

                                </div>

                            </form>

                            {/* ERROR MESSAGE */}
                            {error && (
                                <div className="alert alert-danger mt-4">
                                    ⚠️ {error}
                                </div>
                            )}

                            {/* WEATHER RESULT */}
                            {weather && (
                                <div className="mt-5">

                                    {/* LOCATION */}
                                    <div className="text-center mb-4">

                                        <div className="display-2">
                                            {getWeatherIcon(
                                                weather.weatherCode
                                            )}
                                        </div>

                                        <h3 className="fw-bold mt-2">
                                            {weather.location}
                                        </h3>

                                        <p className="text-muted mb-1">
                                            📍{" "}
                                            {weather.country}
                                        </p>

                                        {weather.time && (
                                            <small className="text-muted">
                                                🕒{" "}
                                                {
                                                    weather.time
                                                }
                                            </small>
                                        )}

                                    </div>

                                    {/* WEATHER CARDS */}
                                    <div className="row g-3">

                                        {/* TEMPERATURE */}
                                        <div className="col-sm-6 col-lg-3">

                                            <div className="card bg-light border-0 text-center h-100">

                                                <div className="card-body">

                                                    <div className="fs-1">
                                                        🌡️
                                                    </div>

                                                    <small className="text-muted">
                                                        {t(
                                                            "temperature"
                                                        )}
                                                    </small>

                                                    <h4 className="fw-bold mt-2">
                                                        {
                                                            weather.temperature
                                                        }{" "}
                                                        °C
                                                    </h4>

                                                </div>

                                            </div>

                                        </div>

                                        {/* HUMIDITY */}
                                        <div className="col-sm-6 col-lg-3">

                                            <div className="card bg-light border-0 text-center h-100">

                                                <div className="card-body">

                                                    <div className="fs-1">
                                                        💧
                                                    </div>

                                                    <small className="text-muted">
                                                        {t(
                                                            "humidity"
                                                        )}
                                                    </small>

                                                    <h4 className="fw-bold mt-2">
                                                        {
                                                            weather.humidity
                                                        }
                                                        %
                                                    </h4>

                                                </div>

                                            </div>

                                        </div>

                                        {/* PRECIPITATION */}
                                        <div className="col-sm-6 col-lg-3">

                                            <div className="card bg-light border-0 text-center h-100">

                                                <div className="card-body">

                                                    <div className="fs-1">
                                                        🌧️
                                                    </div>

                                                    <small className="text-muted">
                                                        {t(
                                                            "precipitation"
                                                        )}
                                                    </small>

                                                    <h4 className="fw-bold mt-2">
                                                        {
                                                            weather.precipitation
                                                        }{" "}
                                                        mm
                                                    </h4>

                                                </div>

                                            </div>

                                        </div>

                                        {/* WIND */}
                                        <div className="col-sm-6 col-lg-3">

                                            <div className="card bg-light border-0 text-center h-100">

                                                <div className="card-body">

                                                    <div className="fs-1">
                                                        💨
                                                    </div>

                                                    <small className="text-muted">
                                                        {t(
                                                            "windSpeed"
                                                        )}
                                                    </small>

                                                    <h4 className="fw-bold mt-2">
                                                        {
                                                            weather.windSpeed
                                                        }{" "}
                                                        km/h
                                                    </h4>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* FARMING INSIGHT */}
                                    <div className="alert alert-success mt-4">

                                        <h5 className="fw-bold mb-2">
                                            🌱{" "}
                                            {t(
                                                "farmingInsight"
                                            )}
                                        </h5>

                                        <p className="mb-0">
                                            {getInsight()}
                                        </p>

                                    </div>

                                    {/* WEATHER INFORMATION */}
                                    <div className="card border-0 bg-light mt-4">

                                        <div className="card-body">

                                            <h5 className="fw-bold mb-3">
                                                🌦️{" "}
                                                {t(
                                                    "currentWeather"
                                                )}
                                            </h5>

                                            <div className="row">

                                                <div className="col-md-6 mb-2">
                                                    <strong>
                                                        {t(
                                                            "temperature"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        weather.temperature
                                                    }{" "}
                                                    °C
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <strong>
                                                        {t(
                                                            "humidity"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        weather.humidity
                                                    }
                                                    %
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <strong>
                                                        {t(
                                                            "precipitation"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        weather.precipitation
                                                    }{" "}
                                                    mm
                                                </div>

                                                <div className="col-md-6 mb-2">
                                                    <strong>
                                                        {t(
                                                            "windSpeed"
                                                        )}
                                                        :
                                                    </strong>{" "}
                                                    {
                                                        weather.windSpeed
                                                    }{" "}
                                                    km/h
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default WeatherInsights;