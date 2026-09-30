import axios from "axios";

/*
 * AgriVibe Production API
 *
 * Vercel:
 * VITE_API_URL must contain your Render backend URL.
 *
 * Example:
 * VITE_API_URL=https://agrivibe-backend.onrender.com
 */

const API_URL = (
    import.meta.env.VITE_API_URL ||
    "https://agrivibe-backend.onrender.com"
).replace(/\/$/, "");

/*
 * Automatically convert old localhost API calls
 * to the deployed Render API.
 */
axios.interceptors.request.use(
    (config) => {
        if (typeof config.url === "string") {
            if (config.url.startsWith("http://localhost:5000")) {
                config.url = config.url.replace(
                    "http://localhost:5000",
                    API_URL
                );
            } else if (config.url.startsWith("/api/")) {
                config.url = API_URL + config.url;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default API_URL;