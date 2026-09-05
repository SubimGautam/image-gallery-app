import React from 'react';
import './Filters.css';

const categories = ['All', 'Nature', 'People', 'Animal', 'Building'];

const Filters = ({ category, onCategoryChange }) => {
    return (
        <div className='filters'>
            {categories.map((cat) => (
                <button
                    key={cat}
                    className={category === cat ? 'active' : ''}
                    onClick={() => onCategoryChange(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default Filters;