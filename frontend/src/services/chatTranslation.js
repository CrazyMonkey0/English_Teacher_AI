import api from "./api";  // import instancji Axios z CSRF interceptor

// Sending text for translation
export const translateText = async (text) => {
    const response = await api.post("/translate", { text });
    return response.data;
};
