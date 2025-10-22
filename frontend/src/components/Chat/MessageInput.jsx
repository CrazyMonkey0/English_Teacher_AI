import React, { useState } from "react";
import { useRecorder } from "../../hooks/useRecorder";
import { Mic, Square, X, Play, Send } from "lucide-react";
import "./chat.css";

/**
 * MessageInput component
 * Handles:
 * - recording and sending voice messages
 * - typing and sending text messages
 * - playing and deleting recorded audio
 */
export default function MessageInput({ onSendText, onSendAudio, disabled }) {
    // Custom hook for audio recording
    const { isRecording, audioURL, startRecording, stopRecording, audioBlob, clearRecording } = useRecorder();

    // Local state for text message
    const [textMessage, setTextMessage] = useState("");

    // Audio player instance
    const [audioPlayer] = useState(() => new Audio());
    const [isPlaying, setIsPlaying] = useState(false);

    /**
     * Handle sending a message (audio or text)
     */
    const handleSend = () => {
        if (disabled) return;

        // If an audio recording exists → send it
        if (audioBlob) {
            onSendAudio(audioBlob);
            clearRecording();
            setIsPlaying(false);
            return;
        }

        // If a text message exists → send it
        if (textMessage.trim()) {
            onSendText(textMessage);
            setTextMessage("");
            return;
        }

        alert("🎤 Record a message or type something first.");
    };

    /**
     * Handle playing or pausing recorded audio
     */
    const handlePlay = () => {
        if (!audioURL) return;

        if (isPlaying) {
            // Pause playback
            audioPlayer.pause();
            setIsPlaying(false);
        } else {
            // Start playback
            audioPlayer.src = audioURL;
            audioPlayer.play();
            setIsPlaying(true);

            // Reset state when playback finishes
            audioPlayer.onended = () => setIsPlaying(false);
        }
    };

    /**
     * Allow sending a message by pressing Enter (without Shift)
     */
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Allow sending only if there's a message or an audio blob
    const canSend = audioBlob || textMessage.trim();

    return (
        <div className="message-input">
            {/* === CAŁY INPUT W JEDNEJ LINII === */}
            <div className="input-row">
                {/* Text input */}
                <textarea
                    type="text"
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={audioBlob ? "Usuń nagranie aby pisać..." : "Wpisz wiadomość..."}
                    disabled={disabled || audioBlob}
                    className="text-input"
                />

                {/* Audio controls */}
                <div className="audio-controls">
                    {/* Record / Stop recording */}
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            disabled={disabled}
                            title="Rozpocznij nagrywanie"
                            className="icon-btn mic"
                        >
                            <Mic size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            title="Zatrzymaj nagrywanie"
                            className="icon-btn stop"
                        >
                            <Square size={20} />
                        </button>
                    )}

                    {/* Play button */}
                    <button
                        onClick={handlePlay}
                        disabled={disabled || !audioURL}
                        title={isPlaying ? "Wstrzymaj" : "Odtwórz nagranie"}
                        className={`icon-btn play ${!audioURL ? 'disabled' : ''}`}
                    >
                        <Play size={20} />
                    </button>

                    {/* Clear button */}
                    <button
                        onClick={clearRecording}
                        disabled={disabled || !audioURL}
                        title="Usuń nagranie"
                        className={`icon-btn clear ${!audioURL ? 'disabled' : ''}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={disabled || !canSend}
                    title="Wyślij wiadomość"
                    className="icon-btn send"
                >
                    <Send size={20} />
                </button>
            </div>

            {/* Loading state */}
            {disabled && <p className="loading">⏳ Ładowanie...</p>}
        </div>
    );
}