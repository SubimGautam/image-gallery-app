import React from 'react';
import './PreviewModal.css';
import { useNavigate } from 'react-router-dom';

const PreviewModal = ({ image, onClose }) => {
    const navigate = useNavigate();
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
                <p>
                    Author:{' '}
                    <span
                        className='preview-author-link'
                        onClick={() => {
                            onClose();
                            navigate(`/profile/${image.userId}`);
                        }}
                    >
                        {image.author}
                    </span>
                </p>
                <p>Category: {image.uploadcategory}</p>
            </div>
        </div>
    );
};

export default PreviewModal;