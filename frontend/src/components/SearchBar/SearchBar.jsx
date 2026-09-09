import React, { useState } from 'react';
import './SearchBar.css';
import SearchIcon from '../../assets/search icon.png';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ value, onChange, searchUsers }) => {
    const [userResults, setUserResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const handleChange = async (text) => {
        onChange(text);

        if (!searchUsers) return;

        if (text.trim() === '') {
            setUserResults([]);
            setShowDropdown(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/users/search?q=${text}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                setUserResults(data);
                setShowDropdown(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectUser = (user) => {
        setShowDropdown(false);
        onChange('');
        navigate(`/profile/${user.id}`);
    };

    return (
        <div className='navbar-search'>
            <input
                type="text"
                placeholder='Search'
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => userResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            />
            <img src={SearchIcon} alt="Search" />

            {showDropdown && userResults.length > 0 && (
                <div className='search-dropdown'>
                    {userResults.map((user) => (
                        <div
                            key={user.id}
                            className='search-dropdown-item'
                            onClick={() => handleSelectUser(user)}
                        >
                            {user.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;