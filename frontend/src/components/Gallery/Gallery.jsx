import React, { useEffect, useState } from 'react'
import './Gallery.css'
import Search from '../../assets/search icon.png'
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
    useEffect(() => {
    const getImages = async () => {
        try {
            const token = localStorage.getItem('token');
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

}, []);
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
        const response = await fetch(`http://localhost:5000/api/images/${editingImage._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                author: author,
                uploadcategory: uploadcategory
            })
        });

        const data = await response.json();

        console.log(data);

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

    const filterImages = images.filter((image) =>
        (image.author || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || image.uploadcategory === category)
    );
    return (
    <div className='album'>
        Image Gallery App
        <div className='search-bar'>
            <input
                type="text"
                placeholder='Search images..'
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
            />
            <button>
                <img src={Search} alt="Search"/>
            </button>
        </div>
        <div className='upload-section'>
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
            <input
                type="file"
                accept="image/*"
                onChange={(e)=>setSelectedImage(e.target.files[0])}
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
                <button onClick={handleUpload}>
                    Upload image
                </button>
            
        </div>
        
        <div className='filters'>
            <button onClick={() => setCategory('All')}>All</button>
            <button onClick={() => setCategory('Nature')}>Nature</button>
            <button onClick={() => setCategory('People')}>People</button>
            <button onClick={() => setCategory('Animal')}>Animal</button>
            <button onClick={() => setCategory('Building')}>Building</button>
        </div>
        <div className='gallery-images'>
            
            {filterImages.map((image) => (
                <div className='image-card' key={image._id}>
                    <img
                        src={`http://localhost:5000${image.imageUrl}`}
                        alt={image.author}
                        onClick={() => setPreviewImage(image)}
                    />
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
    </div>
    )
}
export default Gallery;