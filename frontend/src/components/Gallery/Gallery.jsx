import React, { useEffect, useState } from 'react'
import './Gallery.css'
import { useNavigate } from "react-router-dom";
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import Filters from '../../components/Filters/Filters';
import ImageCard from '../../components/ImageCard/ImageCard';
import Navbar from '../../components/Navbar/Navbar';
import UploadModal from '../../components/UploadModal/UploadModal';
import Sidebar from '../../components/Sidebar/Sidebar';
const Gallery = () => {
    const [images,setImages] = useState([]);
    const [search, setSearch] = useState('');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('All');
    const [uploadcategory, setUploadcategory] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [editingImage, seteditingImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [visibility, setVisibility] = useState('private');
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
            if(response.ok){
                setImages(data);
            } else {
                console.log('Failed to load images:', data.message);
                navigate('/login');
                }
        } catch (error) {
            console.log(error);
        }
    };
    getImages();

}, [navigate]);

    const handleUpload = async (fields) => {
    const formdata = new FormData();
    formdata.append('image', fields.image);
    formdata.append('title', fields.title);
    formdata.append('author', fields.author);
    formdata.append('uploadcategory', fields.uploadcategory);
    formdata.append('visibility', fields.visibility);
    try{
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:5000/api/images', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formdata
        });
        if(!response.ok){
            console.log('Upload failed');
            return false;
        }
        const updatedResponse = await fetch('http://localhost:5000/api/images', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });    
        const updatedImages = await updatedResponse.json();
        setImages(updatedImages);
        return true;
    }catch (error) {
        console.log(error);
        return false;
    }
};

    const handleEdit = (image) => {
        console.log('Edit Clicked');
        console.log(image);
        seteditingImage(image);
        setTitle(image.title);
        setAuthor(image.author);
        setVisibility('private');
        setUploadcategory(image.uploadcategory);
        setVisibility(image.visibility || 'private')
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
                uploadcategory: uploadcategory,
                visibility: visibility
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
                    uploadcategory: uploadcategory,
                    visibility: visibility
                }
                : image
        ));

        seteditingImage(null);
        setTitle('');
        setAuthor('');
        setUploadcategory('');

    } catch (error) {
        console.log(error);
    }
};

    const closeEditModal = () => {
        seteditingImage(null);
        setTitle('');
        setAuthor('');
        setUploadcategory('');
    }

    const handleDelete = async (id) => {
        try{
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/images/${id}`, {
                method: 'Delete',
                headers: {
                    Authorization: 'Bearer${token}'
                }
            });
            const data = await response.json();
            console.log(data)
            if(response.ok){
            setImages(images.filter((image) => image._id !== id));
            }
        }catch(error){
            console.log(error);
        }
    }

    const filterImages = images.filter((image) =>
        (image.author || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || image.uploadcategory === category)
    );

    return (
    <div className='gallery-layout'>
        <Sidebar />
    <div className='album'>
        <Navbar search={search} onSearchChange={setSearch} />

        <div className='gallery-toolbar'>

            <Filters category={category} onCategoryChange={setCategory} />

            <button className='add-photo-btn' onClick={() => setShowUploadModal(true)}>
                + Add Photo
            </button>
        </div>

        <div className='gallery-images'>
            
            {filterImages.map((image) => (
                <ImageCard
                    key={image._id}
                    image={image}
                    onPreview={setPreviewImage}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    />
                ))}

            <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
        </div>

        <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onSubmit={handleUpload}
        />
        {editingImage && (
    <div className='upload-modal-overlay' onClick={closeEditModal}>
        <div className='upload-modal' onClick={(e) => e.stopPropagation()}>
            <button className='upload-modal-close' onClick={closeEditModal}>X</button>

            <h2>Edit photo</h2>
            <p className='upload-modal-subtitle'>Update the details for this image</p>

            <div className='edit-modal-preview'>
                <img
                    src={`http://localhost:5000${editingImage.imageUrl}`}
                    alt={editingImage.author}
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
                            checked = {visibility === 'private'}
                            onChange={(e) => setVisibility(e.target.value)}
                        />
                        Private
                    </label>
                    <label>
                        <input 
                            type='radio'
                            name='edit-visibility'
                            value='public'
                            checked = {visibility === 'public'}
                            onChange={(e) => setVisibility(e.target.value)}
                        />    
                        Public
                    </label>    
                </div>
            </div>

            <button className='upload-modal-submit' onClick={handleUpdate}>
                Save Changes
            </button>
        </div>
    </div>
)}
    </div>
    </div>
    )
}
export default Gallery;