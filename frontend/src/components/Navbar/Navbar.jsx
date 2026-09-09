import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import Logo from '../../assets/logo.png';
import './Navbar.css';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import profile from '../../assets/profile.png'

const Navbar = ({ search, onSearchChange, searchUsers }) => {
    const navigate = useNavigate();

    const handleProfileClick = () => {
    const userString = localStorage.getItem('user');
    if (!userString) {
        navigate('/login');
        return;
    }
    const user = JSON.parse(userString);
    navigate(`/profile/${user.id}`);
};

    return (
        <header className='navbar'>

            <SearchBar value={search} onChange={onSearchChange} searchUsers={searchUsers} />

            <div className='navbar-actions'>
                <button className='navbar-login' onClick={() => navigate('/login')}>Login</button>
                <button className='navbar-submit' onClick={() => navigate('/signup')}>Signup</button>
                <ProfileAvatar />
            </div>
        </header>
    );
};

export default Navbar;