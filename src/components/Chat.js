// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Chat = ({ token, userId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const socket = io('http://localhost:8080', {
        query: { token, userId },
    });

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    const sendMessage = () => {
        socket.emit('message', { sender: userId, content: input, timestamp: Date.now() });
        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.sender}: {msg.content}</div>
                ))}
            </div>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
