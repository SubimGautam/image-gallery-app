import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();

    const userString = localStorage.getItem('user');
    const currentUser = userString ? JSON.parse(userString) : null;
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const [name, setName] = useState(currentUser ? currentUser.name : '');
    const [nameMessage, setNameMessage] = useState('');

    const handlePasswordUpdate = async () => {
        if (!currentUser) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            setPasswordMessage(data.message);

            if (response.ok) {
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error) {
            console.log(error);
            setPasswordMessage('Something went wrong');
        }
    };

    const handleNameUpdate = async () => {
        if (!currentUser) return;

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/users/${currentUser.id}/name`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });

            const data = await response.json();

            if (response.ok) {
                const updatedUser = { ...currentUser, name: data.name };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setNameMessage('Name updated successfully');
            } else {
                setNameMessage(data.message);
            }
        } catch (error) {
            console.log(error);
            setNameMessage('Something went wrong');
        }
    };

    if (!currentUser) return null;

    return (
        <div className='settings-layout'>
            <Sidebar />

            <div className='settings-main'>
                <h1>Settings</h1>

                <div className='settings-section'>
                    <h2>Display Name</h2>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleNameUpdate}>Save Name</button>
                    {nameMessage && <p className='settings-message'>{nameMessage}</p>}
                </div>

            </div>


            <div className='settings-section'>
                <h2>Change Password</h2>
                <input
                    type='password'
                    placeholder='Current password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <br />
                <input
                    type='password'
                    placeholder='New password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <br />
                <button onClick={handlePasswordUpdate}>Update Password</button>
                {passwordMessage && <p className='settings-message'>{passwordMessage}</p>}
            </div>
        </div>
    );
};

export default Settings;