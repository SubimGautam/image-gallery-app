import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Chat.css';

const Chat = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [otherUser, setOtherUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');

    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const loadChat = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const profileResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = await profileResponse.json();
                if (profileResponse.ok) {
                    setOtherUser(profileData);
                }

                const messagesResponse = await fetch(`http://localhost:5000/api/messages/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const messagesData = await messagesResponse.json();
                if (messagesResponse.ok) {
                    setMessages(messagesData);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadChat();
    }, [userId, navigate]);

    const handleSend = async () => {
        if (newMessage.trim() === '') return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: userId,
                    text: newMessage
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages([...messages, data.data]);
                setNewMessage('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!otherUser || !currentUser) return null;

    return (
        <div className='chat-layout'>
            <Sidebar />

            <div className='chat-main'>
                <div className='chat-header'>
                    <h2>{otherUser.name}</h2>
                </div>

                <div className='chat-messages'>
                    {messages.map((msg) => (
                        <div
                            key={msg._id}
                            className={msg.senderId === currentUser.id ? 'chat-bubble sent' : 'chat-bubble received'}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                <div className='chat-input-bar'>
                    <input
                        type='text'
                        placeholder='Type a message...'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;