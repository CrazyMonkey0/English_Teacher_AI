import React, { useState } from "react";

export default function MessageInput({ onSend }) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        onSend(input);
        setInput("");
    };

    return (
        <div className="input-box">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Napisz wiadomość..."
            />
            <button onClick={handleSend}>Wyślij</button>
        </div>
    );
}
