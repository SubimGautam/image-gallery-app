import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Inbox.css';

const AVATAR_COLORS = ['#7C6FE0', '#F2994A', '#EB5757', '#2D9CDB', '#27AE60', '#9B51E0', '#F2C94C'];

const getAvatarColor = (id) => {
    if (!id) return AVATAR_COLORS[0];
    let sum = 0;
    for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
    }
    return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Inbox = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;

    const [conversations, setConversations] = useState([]);
    const [userNames, setUserNames] = useState({});
    const [search, setSearch] = useState('');

    const [activeProfile, setActiveProfile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const loadInbox = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('http://localhost:5000/api/messages', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();

                if (response.ok) {
                    setConversations(data);

                    const namesMap = {};
                    for (const convo of data) {
                        const profileResponse = await fetch(`http://localhost:5000/api/users/${convo.userId}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const profileData = await profileResponse.json();
                        if (profileResponse.ok) {
                            namesMap[convo.userId] = profileData.name;
                        }
                    }
                    setUserNames(namesMap);
                }
            } catch (error) {
                console.log(error);
            }
        };

        loadInbox();
    }, [navigate]);

    useEffect(() => {
        const loadConversation = async () => {
            if (!userId) {
                setActiveProfile(null);
                setMessages([]);
                return;
            }

            const token = localStorage.getItem('token');

            try {
                const profileResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const profileData = await profileResponse.json();
                if (profileResponse.ok) {
                    setActiveProfile(profileData);
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

        loadConversation();
    }, [userId]);

    const handleSend = async () => {
        if (newMessage.trim() === '' || !userId) return;

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

                setConversations((prev) => {
                    const exists = prev.find((c) => c.userId === userId);
                    if (exists) {
                        return prev.map((c) =>
                            c.userId === userId
                                ? { ...c, lastMessage: newMessage, timestamp: data.data.timestamp }
                                : c
                        );
                    }
                    return [{ userId, lastMessage: newMessage, timestamp: data.data.timestamp }, ...prev];
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filteredConversations = conversations.filter((convo) => {
        const name = userNames[convo.userId] || '';
        return name.toLowerCase().includes(search.toLowerCase());
    });

    if (!currentUser) return null;

    return (
        <div className='inbox-layout'>
            <Sidebar />

            <div className='inbox-list-panel'>
                <h1>Inbox</h1>

                <div className='inbox-search'>
                    <span className='inbox-search-icon'>&#128269;</span>
                    <input
                        type='text'
                        placeholder='Search'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className='conversation-list'>
                    {filteredConversations.map((convo) => (
                        <div
                            key={convo.userId}
                            className={convo.userId === userId ? 'conversation-item active' : 'conversation-item'}
                            onClick={() => navigate(`/messages/${convo.userId}`)}
                        >
                            <div
                                className='conversation-avatar'
                                style={{ background: getAvatarColor(convo.userId) }}
                            >
                                {userNames[convo.userId] ? userNames[convo.userId].charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className='conversation-info'>
                                <h3>{userNames[convo.userId] || 'Loading...'}</h3>
                                <p>{convo.lastMessage}</p>
                            </div>
                            <span className='conversation-time'>{formatTime(convo.timestamp)}</span>
                        </div>
                    ))}

                    {filteredConversations.length === 0 && (
                        <p className='no-conversations'>No conversations yet.</p>
                    )}
                </div>
            </div>

            <div className='chat-panel'>
                {activeProfile ? (
                    <>
                        <div className='chat-panel-header'>
                            <div
                                className='conversation-avatar'
                                style={{ background: getAvatarColor(userId) }}
                            >
                                {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <h2>{activeProfile.name}</h2>
                            </div>
                        </div>

                        <div className='chat-messages'>
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={msg.senderId === currentUser.id ? 'chat-row sent' : 'chat-row received'}
                                >
                                    {msg.senderId !== currentUser.id && (
                                        <div
                                            className='chat-avatar-small'
                                            style={{ background: getAvatarColor(userId) }}
                                        >
                                            {activeProfile.name ? activeProfile.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                    <div className='chat-bubble'>
                                        {msg.text}
                                    </div>
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
                            <button onClick={handleSend}>&#10148;</button>
                        </div>
                    </>
                ) : (
                    <div className='chat-empty'>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;