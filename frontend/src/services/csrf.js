// services/csrf.js
import api from "./api";

export async function initCsrf() {
    await api.get("/security/csrf");
}
