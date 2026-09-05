import React from 'react';
import './ImageCard.css';

const ImageCard = ({ image, onPreview, handleDelete, handleEdit }) => {
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
            </div>
        </div>
    );
};

export default ImageCard;