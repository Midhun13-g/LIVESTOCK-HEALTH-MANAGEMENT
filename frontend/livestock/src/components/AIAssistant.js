import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chat = () => {
    const [messages, setMessages] = useState([]); // Store chat messages
    const [input, setInput] = useState(''); // Store user input
    const [error, setError] = useState(null); // Store any error message

    // Scroll chat box to the latest message automatically
    useEffect(() => {
        const chatBox = document.querySelector('.chat-box');
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return; // Avoid empty messages
   
        // Add user message to chat
        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
   
        try {
            // Send user input to the backend
            const response = await fetch('http://localhost:8000/chatbot/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
   
            // Check if response is okay
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
   
            const data = await response.json();
            console.log('Backend response:', data);  // Add this log to inspect the response
   
            // Add bot response to chat
            if (data.response) {
                setMessages([...newMessages, { role: 'bot', text: data.response }]);
            } else {
                console.error('Unexpected response format:', data);
                setError('The bot response is not in the expected format.');
            }
        } catch (error) {
            console.error('Error connecting to chatbot:', error);
            setError('Failed to connect to the chatbot. Please try again later.');
        }
   
        setInput(''); // Clear input field
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="border border-primary rounded p-4 bg-white shadow" style={{ maxWidth: '500px', width: '100%' }}>
                <h1 className="mb-4 text-center">Chat Room</h1>

                <div className="mb-3 chat-box" style={{ height: '300px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.role === 'user' ? 'text-end' : 'text-start'}>
                            <strong>{msg.role === 'user' ? 'You' : 'Cooper'}:</strong> {msg.text}
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Enter your message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={handleSend}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
