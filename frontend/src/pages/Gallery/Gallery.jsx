import React, { useEffect, useState } from 'react'
import './Gallery.css'
import { useNavigate } from "react-router-dom";
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import Filters from '../../components/Filters/Filters';
import ImageCard from '../../components/ImageCard/ImageCard';
import Navbar from '../../components/Navbar/Navbar';
import UploadModal from '../../components/UploadModal/UploadModal';
import Sidebar from '../../components/Sidebar/Sidebar';
import EditModal from '../../components/EditModal/EditModal';
const Gallery = () => {
    const [images,setImages] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [previewImage, setPreviewImage] = useState('');
    const [editingImage, seteditingImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
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
        seteditingImage(image);
    }

    const handleUpdate = async (id, fields) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/images/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(fields)
        });

        const data = await response.json();

        if(!response.ok) {
            console.log('Update Failed', data);
            return false;
        }

        setImages(images.map((image) =>
            image._id === id
                ? { ...image, ...fields }
                : image
        ));

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
};

    const closeEditModal = () => {
        seteditingImage(null);
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
        <EditModal
            image={editingImage}
            onClose={closeEditModal}
            onSubmit={handleUpdate}
        />
    </div>
    </div>
    )
}
export default Gallery;