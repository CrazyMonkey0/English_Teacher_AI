import React, { useState } from 'react';
import MessageInput from './MessageInput';
import "./chat.css";

function ChatBox() {
    const [messages, setMessages] = useState([]);

    const sendMessage = (text) => {
        if (text.trim()) {
            setMessages((prev) => [...prev, { sender: 'user', text: text }]);
        }
    };

    return (
        <div className="chatbox">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index}
                        className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <MessageInput onSend={sendMessage} />
        </div>
    );
}

export default ChatBox;