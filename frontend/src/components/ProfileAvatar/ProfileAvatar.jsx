import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileAvatar.css';

const ProfileAvatar = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const getProfile = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getProfile();
    }, []);

    if (!user) return null;

    return (
        <button className='profile-avatar-btn' onClick={() => navigate(`/profile/${user.id}`)}>
            {profile && profile.profilePicture ? (
                <img src={`http://localhost:5000${profile.profilePicture}`} alt={user.name} />
            ) : (
                <span>{user.name ? user.name.charAt(0).toUpperCase() : '?'}</span>
            )}
        </button>
    );
};

export default ProfileAvatar;