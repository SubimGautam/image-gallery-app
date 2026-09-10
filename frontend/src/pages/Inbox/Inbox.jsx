import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Inbox.css';

const Inbox = () => {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [userNames, setUserNames] = useState({});

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

    return (
        <div className='inbox-layout'>
            <Sidebar />

            <div className='inbox-main'>
                <h1>Messages</h1>

                <div className='conversation-list'>
                    {conversations.map((convo) => (
                        <div
                            key={convo.userId}
                            className='conversation-item'
                            onClick={() => navigate(`/messages/${convo.userId}`)}
                        >
                            <div className='conversation-avatar'>
                                {userNames[convo.userId] ? userNames[convo.userId].charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className='conversation-info'>
                                <h3>{userNames[convo.userId] || 'Loading...'}</h3>
                                <p>{convo.lastMessage}</p>
                            </div>
                        </div>
                    ))}

                    {conversations.length === 0 && (
                        <p className='no-conversations'>No conversations yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Inbox;