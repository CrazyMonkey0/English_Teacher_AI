import React, { useState } from "react";
import { useRecorder } from "../../hooks/useRecorder";

export default function MessageInput({ onSendText, onSendAudio, disabled }) {
    const { isRecording, audioURL, startRecording, stopRecording, audioBlob, clearRecording } = useRecorder();
    const [textMessage, setTextMessage] = useState("");

    // One button - priority: audio > text
    const handleSend = () => {
        if (disabled) return;

        // If audio available - send audio
        if (audioBlob) {
            onSendAudio(audioBlob);
            clearRecording();
            return;
        }

        // If text available - send text
        if (textMessage.trim()) {
            onSendText(textMessage);
            setTextMessage("");
            return;
        }

        // If nothing to send
        alert("Nagraj wiadomość lub wpisz tekst.");
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Check if we can send (either audio or text)
    const canSend = audioBlob || textMessage.trim();

    return (
        <div className="message-input">
            {/* Recording section */}
            <div className="recording-section">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        disabled={disabled}
                        className="btn-record"
                    >
                        🎤 Nagraj
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="btn-stop"
                    >
                        ⏹️ Zatrzymaj
                    </button>
                )}

                {audioURL && (
                    <div className="audio-preview">
                        <audio src={audioURL} controls />
                        <button
                            onClick={clearRecording}
                            disabled={disabled}
                            className="btn-clear"
                        >
                            ❌ Usuń nagranie
                        </button>
                    </div>
                )}
            </div>

            {/* Text section */}
            <div className="text-section">
                <input
                    type="text"
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={audioBlob ? "Masz nagranie (usuń je aby pisać)" : "Wpisz wiadomość..."}
                    disabled={disabled || audioBlob}
                    className="text-input"
                />

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled || !canSend}
                    className="btn-send"
                >
                    {audioBlob ? "🎤 Wyślij nagranie" : "💬 Wyślij"}
                </button>
            </div>

            {disabled && <p className="loading-indicator">Ładowanie...</p>}
        </div>
    );
}