// services/api.js
import axios from "axios";
import { getCookie } from "./cookies";

// Tworzymy instancję Axios
const api = axios.create({
    baseURL: "http://127.0.0.1:8000",  // Twój backend
    withCredentials: true,             // wysyła JWT + CSRF cookie
});

// Interceptor automatycznie dodaje CSRF do POST/PUT/DELETE/PATCH
api.interceptors.request.use((config) => {
    if (config.method && !["get", "head", "options"].includes(config.method)) {
        // const csrf = getCookie("__Host-csrf"); // jeśli używasz "__Host-" prefixu
        const csrf = getCookie("csrf_token");
        if (csrf) {
            config.headers["X-CSRF-Token"] = csrf;
        }
    }
    return config;
});

export default api;
