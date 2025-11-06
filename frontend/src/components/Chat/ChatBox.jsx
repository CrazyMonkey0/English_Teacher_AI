import React, { useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import { useChat } from '../../hooks/useChat';
import { translateText } from '../../services/chatTranslation';
import "./chat.css";

function ChatBox() {
    const { messages, sendMessage, sendAudioMessage, loading } = useChat();
    const messagesEndRef = useRef(null);
    const [translations, setTranslations] = useState({});
    const [visibleTranslations, setVisibleTranslations] = useState({});

    // Auto-scroll 
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleTranslate = async (index, text) => {
        setTranslations(prev => ({
            ...prev,
            [index]: "Translating..."
        }));

        try {
            const res = await translateText(text);
            setTranslations(prev => ({
                ...prev,
                [index]: res.translation || res.translated_text || "Translation unavailable."
            }));

            // pokaż tłumaczenie po zakończeniu
            setVisibleTranslations(prev => ({
                ...prev,
                [index]: true
            }));
        } catch (err) {
            console.error("Translation error:", err);
            setTranslations(prev => ({
                ...prev,
                [index]: "Translation failed."
            }));
        }
    };

    const toggleTranslation = (index) => {
        setVisibleTranslations(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div className="chatbox">
            <div className="chat-header">
                <h2>Asystent językowy</h2>
                <p>Rozmawiam i poprawiam twoje błędy</p>
            </div>

            <div className="messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"} ${msg.type === "error" ? "error-msg" : ""}`}
                    >
                        <div className="message-content">
                            <p>{msg.text}</p>

                            {/* Audio bot (speech synthesis) */}
                            {msg.audio && (
                                <audio src={msg.audio} controls className="bot-audio" />
                            )}

                            {/* Przycisk tłumaczenia — tylko jeśli brak tłumaczenia */}
                            {!translations[index] && (
                                <button
                                    className="translate-btn"
                                    onClick={() => handleTranslate(index, msg.text)}
                                    disabled={loading}
                                >
                                    Translate
                                </button>
                            )}

                            {/* Wyświetlane tłumaczenie */}
                            {translations[index] && visibleTranslations[index] && (
                                <>
                                    <p className="translation">{translations[index]}</p>
                                    <button
                                        className="hide-btn"
                                        onClick={() => toggleTranslation(index)}
                                    >
                                        Hide Translation
                                    </button>
                                </>
                            )}

                            {/* Pokaż tłumaczenie jeśli jest ukryte */}
                            {translations[index] && !visibleTranslations[index] && (
                                <button
                                    className="show-btn"
                                    onClick={() => toggleTranslation(index)}
                                >
                                    Translate
                                </button>
                            )}
                        </div>

                        <span className="message-time">
                            {new Date().toLocaleTimeString('pl-PL', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput
                onSendText={sendMessage}
                onSendAudio={sendAudioMessage}
                disabled={loading}
            />
        </div>
    );
}

export default ChatBox;