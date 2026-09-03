import React, { useEffect, useState } from 'react'
import './Gallery.css'
import Search from '../../assets/search icon.png'
import { useNavigate } from "react-router-dom";
const Gallery = () => {
    const [images,setImages] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('All');
    const [uploadcategory, setUploadcategory] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [editingImage, seteditingImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
    const getImages = async () => {
        try {
            const token = localStorage.getItem('token');
            if(!token){
                navigate('/login');
                return;
            }
            const response = await fetch(
                'http://localhost:5000/api/images',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            console.log('GET IMAGES:', data);
            setImages(data);
        } catch (error) {
            console.log(error);
        }
    };
    getImages();

}, [navigate]);
    const handleUpload = async () => {
        if (!selectedImage){
            alert('Please upload an image')
            return;
        }
        // const token = localStorage.getItem('token');
        const formdata = new FormData();
        formdata.append('image', selectedImage);
        formdata.append('title', title);
        formdata.append('author', author);
        formdata.append('category', category);
        formdata.append('uploadcategory', uploadcategory);
        try{
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/api/images', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formdata
            });
            const data = await response.json();
            console.log(data);
            const updatedResponse = await fetch('http://localhost:5000/api/images', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });    
            const updatedImages = await updatedResponse.json();
            setImages(updatedImages);
            setSelectedImage(null);
            setTitle('');
            setAuthor('');
            setUploadcategory('');
            setShowUploadModal(false);
        }catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (image) => {
        console.log('Edit Clicked');
        console.log(image);
        seteditingImage(image);
        setTitle(image.title);
        setAuthor(image.author);
        setUploadcategory(image.uploadcategory);
        console.log('editingImage should now be:', image);
    }

    const handleUpdate = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/images/${editingImage._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                author: author,
                uploadcategory: uploadcategory
            })
        });

        const data = await response.json();

        console.log(data);

        if(!response.ok) {
            console.log('Update Failed', data);
            return;
        }

        setImages(images.map((image) =>
            image._id === editingImage._id
                ? {
                    ...image,
                    title: title,
                    author: author,
                    uploadcategory: uploadcategory
                }
                : image
        ));

        seteditingImage(null);

    } catch (error) {
        console.log(error);
    }
};


    const handleDelete = async (id) => {
        try{
            const response = await fetch(`http://localhost:5000/api/images/${id}`, {
                method: 'Delete'
            });
            const data = await response.json();
            console.log(data)
        }catch(error){
            console.log(error);
        }
    }

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

    const closeUploadModal = () => {
        setShowUploadModal(false);
        setSelectedImage(null);
        setTitle('');
        setAuthor('');
        setUploadcategory('');
    };

    const filterImages = images.filter((image) =>
        (image.author || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || image.uploadcategory === category)
    );

    return (
    <div className='album'>
        <header className='navbar'>
            <div className='navbar-logo'>PIX</div>

            <div className='navbar-search'>
                <input
                    type="text"
                    placeholder='Search'
                    value={search}
                    onChange={(e)=> setSearch(e.target.value)}
                />
                <img src={Search} alt="Search"/>
            </div>

            <div className='navbar-actions'>
                <button className='navbar-link'>Filter</button>
                <button className='navbar-login' onClick={() => navigate('/login')}>Login</button>
                <button className='navbar-submit' onClick={() => navigate('/signup')}>Signup</button>
            </div>
        </header>

        <div className='gallery-toolbar'>
            {editingImage && (
    <div className="edit-form">

        <h2>Edit Image</h2>

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

        <button onClick={handleUpdate}>
            Update
        </button>

        <button onClick={() => seteditingImage(null)}>
            Cancel
        </button>

    </div>
)}

            <div className='filters'>
                <button className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>All</button>
                <button className={category === 'Nature' ? 'active' : ''} onClick={() => setCategory('Nature')}>Nature</button>
                <button className={category === 'People' ? 'active' : ''} onClick={() => setCategory('People')}>People</button>
                <button className={category === 'Animal' ? 'active' : ''} onClick={() => setCategory('Animal')}>Animal</button>
                <button className={category === 'Building' ? 'active' : ''} onClick={() => setCategory('Building')}>Building</button>
            </div>

            <button className='add-photo-btn' onClick={() => setShowUploadModal(true)}>
                + Add Photo
            </button>
        </div>

        <div className='gallery-images'>
            
            {filterImages.map((image) => (
                <div className='image-card' key={image._id}>
                    <div className='image-frame'>
                        <img
                            src={`http://localhost:5000${image.imageUrl}`}
                            alt={image.author}
                            onClick={() => setPreviewImage(image)}
                        />
                    </div>
                    <div className='image-info'>
                        <h3>{image.title || 'Untitled'}</h3>
                        <p>{image.author || 'Unknown'}</p>

                        <button onClick={() => handleEdit(image)}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(image._id)}>
                            Delete
                        </button>
                    </div>

                </div>
            ))}

                {previewImage && (
            <div className="image-preview">
            <div className="preview-content">
            <button onClick={() => setPreviewImage(null)}>
                X
            </button>
            <img
                src={`http://localhost:5000${previewImage.imageUrl}`}
                alt={previewImage.author}
            />
            <h2>{previewImage.title}</h2>
            <p>Author: {previewImage.author}</p>
            <p>Category: {previewImage.uploadcategory}</p>
        </div>
    </div>
)}
        </div>

        {showUploadModal && (
            <div className='upload-modal-overlay' onClick={closeUploadModal}>
                <div className='upload-modal' onClick={(e) => e.stopPropagation()}>
                    <button className='upload-modal-close' onClick={closeUploadModal}>X</button>

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
                    </div>

                    <button className='upload-modal-submit' onClick={handleUpload}>
                        Post Photo
                    </button>
                </div>
            </div>
        )}
    </div>
    )
}
export default Gallery;