import React from 'react';
import './ImageCard.css';

const ImageCard = ({ image, onPreview, handleDelete, handleEdit, showDownload }) => {
    return (
        <div className='image-card'>
            <div className='image-frame'>
                <img
                    src={`http://localhost:5000${image.imageUrl}`}
                    alt={image.author}
                    onClick={() => onPreview(image)}
                />
            </div>
            <div className='image-info'>
                <h3>{image.title || 'Untitled'}</h3>
                <p>{image.author || 'Unknown'}</p>

                {handleEdit && (
                    <button onClick={() => handleEdit(image)}>
                        Edit
                    </button>
                )}

                {handleDelete && (
                    <button onClick={() => handleDelete(image._id)}>
                        Delete
                    </button>
                )}

                {showDownload && (
                    <a
                        href={`http://localhost:5000${image.imageUrl}`}
                        download
                        className='download-btn'
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
};

export default ImageCard;
