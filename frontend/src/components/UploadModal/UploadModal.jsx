import React, { useState } from 'react';
import './UploadModal.css';

const UploadModal = ({ isOpen, onClose, onSubmit }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [uploadcategory, setUploadcategory] = useState('');
    const [visibility, setVisibility] = useState('private');
    const [isDragging, setIsDragging] = useState(false);

    if (!isOpen) return null;

    const resetForm = () => {
        setSelectedImage(null);
        setTitle('');
        setAuthor('');
        setUploadcategory('');
        setVisibility('private');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setSelectedImage(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleSubmit = async () => {
        if (!selectedImage) {
            alert('Please upload an image');
            return;
        }
        const success = await onSubmit({
            image: selectedImage,
            title,
            author,
            uploadcategory,
            visibility
        });
        if (success) {
            resetForm();
            onClose();
        }
    };

    return (
        <div className='upload-modal-overlay' onClick={handleClose}>
            <div className='upload-modal' onClick={(e) => e.stopPropagation()}>
                <button className='upload-modal-close' onClick={handleClose}>X</button>

                <h2>Add a photo</h2>
                <p className='upload-modal-subtitle'>Share something you've made or found</p>

                <label
                    className={`dropzone ${isDragging ? 'dragging' : ''} ${selectedImage ? 'has-image' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                        hidden
                    />
                    {selectedImage ? (
                        <img
                            className='dropzone-preview'
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                        />
                    ) : (
                        <div className='dropzone-placeholder'>
                            <span className='dropzone-icon'>&#8593;</span>
                            <p>Drag an image here</p>
                            <span>or click to browse</span>
                        </div>
                    )}
                </label>

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
                                name='visibility'
                                value='private'
                                checked={visibility === 'private'}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            Private
                        </label>
                        <label>
                            <input
                                type='radio'
                                name='visibility'
                                value='public'
                                checked={visibility === 'public'}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            Public
                        </label>
                    </div>
                </div>

                <button className='upload-modal-submit' onClick={handleSubmit}>
                    Post Photo
                </button>
            </div>
        </div>
    );
};

export default UploadModal;