import React from 'react';
import './SearchBar.css';
import SearchIcon from '../../assets/search icon.png';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className='navbar-search'>
            <input
                type="text"
                placeholder='Search'
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <img src={SearchIcon} alt="Search" />
        </div>
    );
};

export default SearchBar;