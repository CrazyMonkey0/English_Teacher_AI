// hooks/useChat.js
import { useState } from "react";
import { sendMessageToBot } from "../services/chatService.js";

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        setMessages((prev) => [...prev, { sender: "user", text }]);
        setLoading(true);

        try {
            const botReply = await sendMessageToBot(text);
            setMessages((prev) => [...prev, { sender: "bot", text: botReply.response, audio: botReply.audio }]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [...prev, { sender: "bot", text: "Błąd w odpowiedzi bota" }]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, loading };
};
