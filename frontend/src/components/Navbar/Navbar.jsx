import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import Logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = ({ search, onSearchChange }) => {
    const navigate = useNavigate();

    return (
        <header className='navbar'>

            <SearchBar value={search} onChange={onSearchChange} />

            <div className='navbar-actions'>
                <button className='navbar-link'>Filter</button>
                <button className='navbar-login' onClick={() => navigate('/login')}>Login</button>
                <button className='navbar-submit' onClick={() => navigate('/signup')}>Signup</button>
            </div>
        </header>
    );
};

export default Navbar;