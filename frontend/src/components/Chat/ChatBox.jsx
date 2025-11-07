import React, { useEffect, useRef, useState } from 'react';
import MessageInput from './MessageInput';
import { useChat } from '../../hooks/useChat';
import { translateText } from '../../services/chatTranslation';
import { Play, Pause } from 'lucide-react';
import "./chat.css";

function ChatBox() {
    const { messages, sendMessage, sendAudioMessage, loading } = useChat();
    const messagesEndRef = useRef(null);
    const [translations, setTranslations] = useState({});
    const [visibleTranslations, setVisibleTranslations] = useState({});
    const [playingIndex, setPlayingIndex] = useState(null);
    const audioPlayerRef = useRef(new Audio());

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

    const handlePlayAudio = (index, audioSrc) => {
        const player = audioPlayerRef.current;

        // Jeśli aktualnie odtwarzamy to samo audio - zatrzymaj
        if (playingIndex === index) {
            player.pause();
            setPlayingIndex(null);
            return;
        }

        // Zatrzymaj poprzednie audio jeśli było odtwarzane
        player.pause();

        // Ustaw nowe źródło i odtwórz
        player.src = audioSrc;
        player.play();
        setPlayingIndex(index);

        // Resetuj stan po zakończeniu odtwarzania
        player.onended = () => {
            setPlayingIndex(null);
        };
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

                            {/* tłumaczenie nad przyciskami */}
                            {translations[index] && visibleTranslations[index] && (
                                <p className="translation">{translations[index]}</p>
                            )}

                            <div className="message-buttons">
                                {msg.audio && (
                                    <button
                                        onClick={() => handlePlayAudio(index, msg.audio)}
                                        title={playingIndex === index ? "Wstrzymaj" : "Odtwórz nagranie"}
                                        className={`mess ${playingIndex === index ? "pause" : "play"}`}
                                    >
                                        {playingIndex === index ? <Pause size={20} /> : <Play size={20} />}
                                    </button>
                                )}

                                {!translations[index] && (
                                    <button
                                        className="show-btn"
                                        onClick={() => handleTranslate(index, msg.text)}
                                        disabled={loading}
                                    >
                                        Translate
                                    </button>
                                )}

                                {translations[index] && visibleTranslations[index] && (
                                    <button
                                        className="hide-btn"
                                        onClick={() => toggleTranslation(index)}
                                    >
                                        Hide Translation
                                    </button>
                                )}

                                {translations[index] && !visibleTranslations[index] && (
                                    <button
                                        className="show-btn"
                                        onClick={() => toggleTranslation(index)}
                                    >
                                        Translate
                                    </button>
                                )}
                            </div>
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