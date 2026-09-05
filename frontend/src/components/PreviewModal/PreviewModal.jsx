import React from 'react';
import './PreviewModal.css';

const PreviewModal = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div className="image-preview">
            <div className="preview-content">
                <button onClick={onClose}>
                    X
                </button>
                <img
                    src={`http://localhost:5000${image.imageUrl}`}
                    alt={image.author}
                />
                <h2>{image.title}</h2>
                <p>Author: {image.author}</p>
                <p>Category: {image.uploadcategory}</p>
            </div>
        </div>
    );
};

export default PreviewModal;