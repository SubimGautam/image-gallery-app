import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import ImageCard from '../../components/ImageCard/ImageCard';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import './Profile.css';

const Profile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [activeTab, setActiveTab] = useState('created');
    const [savedImages, setSavedImages] = useState([]);

    useEffect(() => {
    const getProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const profileResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const profileData = await profileResponse.json();

            if (!profileResponse.ok) {
                console.log('Failed to load profile:', profileData.message);
                return;
            }
            setProfile(profileData);

            const imagesResponse = await fetch(`http://localhost:5000/api/users/${id}/images`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const imagesData = await imagesResponse.json();

            if (imagesResponse.ok) {
                setImages(imagesData);
            }

            if (profileData.isOwnProfile) {
                const savedResponse = await fetch(`http://localhost:5000/api/users/${id}/saved-images`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const savedData = await savedResponse.json();

                if (savedResponse.ok) {
                    setSavedImages(savedData);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    getProfile();
}, [id, navigate]);

    const handleFollowToggle = async () => {
        const token = localStorage.getItem('token');
        const action = profile.isFollowing ? 'unfollow' : 'follow';

        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}/${action}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                setProfile({
                    ...profile,
                    isFollowing: !profile.isFollowing,
                    followerCount: profile.isFollowing
                        ? profile.followerCount - 1
                        : profile.followerCount + 1
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formdata = new FormData();
        formdata.append('avatar', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/${id}/avatar`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formdata
            });

            const data = await response.json();

            if (response.ok) {
                setProfile({ ...profile, profilePicture: data.profilePicture });
            } else {
                console.log('Avatar upload failed:', data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!profile) return null;

    return (
        <div className='profile-layout'>
            <Sidebar />

            <div className='profile-main'>
                <div className='profile-header'>
                    <label className='profile-avatar'>
                            {profile.profilePicture ? (
                                <img
                                    src={`http://localhost:5000${profile.profilePicture}`}
                                    alt={profile.name}
                                />
                            ) : (
                                profile.name ? profile.name.charAt(0).toUpperCase() : '?'
                            )}

                            {profile.isOwnProfile && (
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleAvatarUpload}
                                    hidden
                                />
                            )}
                        </label>

                    <div className='profile-details'>
                        <h1>{profile.name}</h1>

                        <div className='profile-stats'>
                            <span><strong>{profile.followerCount}</strong> Followers</span>
                            <span><strong>{profile.followingCount}</strong> Following</span>
                        </div>

                        {!profile.isOwnProfile && (
                            <button
                                className={profile.isFollowing ? 'unfollow-btn' : 'follow-btn'}
                                onClick={handleFollowToggle}
                            >
                                {profile.isFollowing ? 'Unfollow' : 'Follow'}
                            </button>
                        )}
                    </div>
                </div>

                {profile.isOwnProfile && (
    <div className='profile-tabs'>
        <button
            className={activeTab === 'created' ? 'active' : ''}
            onClick={() => setActiveTab('created')}
        >
            Created
        </button>
        <button
            className={activeTab === 'saved' ? 'active' : ''}
            onClick={() => setActiveTab('saved')}
        >
            Saved
        </button>
    </div>
)}

<div className='gallery-images'>
    {(activeTab === 'saved' ? savedImages : images).map((image) => (
        <ImageCard
            key={image._id}
            image={image}
            onPreview={setPreviewImage}
        />
    ))}
</div>

                <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
            </div>
        </div>
    );
};

export default Profile;