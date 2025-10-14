import { useState } from "react";
import { sendMessageToBot, sendAudioMessageToBot } from "../services/chatService.js";

export const useChat = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sending text message
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        setMessages((prev) => [...prev, { sender: "user", text, type: "text" }]);
        setLoading(true);

        try {
            const botReply = await sendMessageToBot(text);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: botReply.response,
                    audio: botReply.audio,
                    type: "text"
                }
            ]);
        } catch (err) {
            console.error("Błąd wysyłania wiadomości:", err);
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Błąd w odpowiedzi bota", type: "error" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Sending audio message
    const sendAudioMessage = async (audioBlob) => {
        if (!audioBlob) return;

        setMessages((prev) => [
            ...prev,
            { sender: "user", text: "🎤 Nagranie audio...", type: "audio", audioBlob }
        ]);
        setLoading(true);

        try {
            const result = await sendAudioMessageToBot(audioBlob);

            // Update last user message with actual transcription
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    sender: "user",
                    text: result.transcription,
                    type: "audio",
                    audioBlob
                };
                return newMessages;
            });

            // Add bot response
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: result.response,
                    audio: result.audio,
                    type: "text"
                }
            ]);
        } catch (err) {
            console.error("Błąd przetwarzania audio:", err);

            // Update last user message to show error
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    sender: "user",
                    text: "❌ Błąd przetwarzania nagrania",
                    type: "error"
                };
                return newMessages;
            });

            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "Nie udało się przetworzyć nagrania", type: "error" }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return { messages, sendMessage, sendAudioMessage, loading };
};