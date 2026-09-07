import React from 'react';
import './ImageCard.css';

const ImageCard = ({ image, onPreview, handleDelete, handleEdit, showDownload }) => {
    const handleDownload = async (image) => {
    const confirmed = window.confirm('Are you sure you want to download this image?');
    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:5000${image.imageUrl}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = image.imageUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.log('Download failed:', error);
    }
};
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
                    <button className='download-btn' onClick={() => handleDownload(image)}>
                        Download
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageCard;
