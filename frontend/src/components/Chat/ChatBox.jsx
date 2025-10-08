import React from 'react';
import MessageInput from './MessageInput';
import { useChat } from '../../hooks/useChat';
import "./chat.css";

function ChatBox() {
    const { messages, sendMessage, loading } = useChat();

    return (
        <div className="chatbox">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
                        <p>{msg.text}</p>
                        {msg.audio && <audio src={msg.audio} controls />}
                    </div>
                ))}
            </div>
            <MessageInput onSend={sendMessage} disable={loading} />
        </div>
    );
}

export default ChatBox;
