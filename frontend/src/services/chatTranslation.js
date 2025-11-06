import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Sending text for translation
export const translateText = async (text) => {
    const response = await axios.post(`${API_BASE}/translate`, { text });
    return response.data;
};