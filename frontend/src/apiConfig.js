import axios from "axios";

/*
 * AgriVibe API Configuration
 *
 * Development:
 *   http://localhost:5000
 *
 * Production:
 *   VITE_API_URL from Vercel
 */

const API_URL = (
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000"
).replace(/\/$/, "");


/*
 * Convert localhost API URLs
 * to the deployed Render backend.
 */

axios.interceptors.request.use(
    (config) => {

        if (
            typeof config.url === "string" &&
            config.url.startsWith("http://localhost:5000")
        ) {
            config.url = config.url.replace(
                "http://localhost:5000",
                API_URL
            );
        }

        /*
         * Support relative API URLs
         * such as /api/products
         */

        else if (
            typeof config.url === "string" &&
            config.url.startsWith("/api/")
        ) {
            config.url = API_URL + config.url;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default API_URL;