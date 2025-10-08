import axios from "axios";

export const sendMessageToBot = async (message) => {
    const response = await axios.post("http://127.0.0.1:8000/nlp/chat", { message });
    return response.data;
};