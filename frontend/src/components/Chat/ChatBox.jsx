import React, { useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { useChat } from '../../hooks/useChat';
import "./chat.css";

function ChatBox() {
    const { messages, sendMessage, sendAudioMessage, loading } = useChat();
    const messagesEndRef = useRef(null);

    // Auto-scroll 
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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