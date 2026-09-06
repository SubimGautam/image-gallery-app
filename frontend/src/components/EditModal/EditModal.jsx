import React, { useState, useEffect } from 'react';
import '../UploadModal/UploadModal.css';
import './EditModal.css';

const EditModal = ({ image, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [uploadcategory, setUploadcategory] = useState('');
    const [visibility, setVisibility] = useState('private');

    useEffect(() => {
        if (image) {
            setTitle(image.title || '');
            setAuthor(image.author || '');
            setUploadcategory(image.uploadcategory || '');
            setVisibility(image.visibility || 'private');
        }
    }, [image]);

    if (!image) return null;

    const handleSave = async () => {
        const success = await onSubmit(image._id, {
            title,
            author,
            uploadcategory,
            visibility
        });
        if (success) {
            onClose();
        }
    };

    return (
        <div className='upload-modal-overlay' onClick={onClose}>
            <div className='upload-modal' onClick={(e) => e.stopPropagation()}>
                <button className='upload-modal-close' onClick={onClose}>X</button>

                <h2>Edit photo</h2>
                <p className='upload-modal-subtitle'>Update the details for this image</p>

                <div className='edit-modal-preview'>
                    <img
                        src={`http://localhost:5000${image.imageUrl}`}
                        alt={image.author}
                    />
                </div>

                <div className='upload-modal-fields'>
                    <input
                        type="text"
                        placeholder="Image title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                    <select
                        value={uploadcategory}
                        onChange={(e) => setUploadcategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="Nature">Nature</option>
                        <option value="People">People</option>
                        <option value="Animal">Animal</option>
                        <option value="Building">Building</option>
                    </select>

                    <div className='visibility-toggle'>
                        <label>
                            <input
                                type='radio'
                                name='edit-visibility'
                                value='private'
                                checked={visibility === 'private'}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            Private
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='edit-visibility'
                                value='public'
                                checked={visibility === 'public'}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            Public
                        </label>
                    </div>
                </div>

                <button className='upload-modal-submit' onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default EditModal;