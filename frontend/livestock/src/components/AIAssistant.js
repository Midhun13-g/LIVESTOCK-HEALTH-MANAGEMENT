import React, { useState, useEffect } from 'react';
import './AIAssistant.css'; // Import the CSS file

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const chatBox = document.querySelector('.chat-box');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);

        try {
            const response = await fetch('http://localhost:8000/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.response) {
                setMessages([...newMessages, { role: 'bot', text: data.response }]);
            } else {
                setError('The bot response is not in the expected format.');
            }
        } catch (error) {
            setError('Failed to connect to the chatbot. Please try again later.');
        }

        setInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-box-container">
                <h1 className="chat-header">Chat Room</h1>

                <div className="chat-box">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role === 'user' ? 'chat-message-user' : 'chat-message-bot'}`}>
                            <strong>{msg.role === 'user' ? 'You' : 'Cooper'}:</strong> {msg.text}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="alert">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    className="chat-input"
                    placeholder="Enter your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="chat-send-button" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
