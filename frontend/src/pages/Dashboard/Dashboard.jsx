import React, { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {

    const [publicImages, setPublicImages] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [category, setCategory] = useState('All');
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getPublicImages = async () => {
            try{
                const token = localStorage.getItem('token');
                if(!token){
                    console.log('No token found');
                    return;
                }
                const response = await fetch('http://localhost:5000/api/images/public', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log('Public Images: ', data);
                if(response.ok){
                    setPublicImages(data);
                } else {
                    console.log('Failed to load public images:', data.message);
                }
            } catch (error){
                console.log(error);
            }
        };
        getPublicImages();
    },[]);

    const filterImages = publicImages.filter((image) =>
        category === 'All' || image.uploadcategory === category
    );

    return(

    <div className='dashboard-layout'>

        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
            <button className='sidebar-toggle' onClick={() => setSideBarOpen(!sidebarOpen)}>
                ☰
            </button>
            
            <nav className='sidebar-nav'>
            {/* <button className='sidebar-link' onClick={() => navigate('/')}>
                <span className='sidebar-icon'>🖼️</span>
                <span className='sidebar-label'>Gallery</span>
            </button> */}
    </nav>

        </aside>

        <div className='dashboard-main'>
            

            <div className='filters'>
                <button className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>All</button>
                <button className={category === 'Nature' ? 'active' : ''} onClick={() => setCategory('Nature')}>Nature</button>
                <button className={category === 'People' ? 'active' : ''} onClick={() => setCategory('People')}>People</button>
                <button className={category === 'Animal' ? 'active' : ''} onClick={() => setCategory('Animal')}>Animal</button>
                <button className={category === 'Building' ? 'active' : ''} onClick={() => setCategory('Building')}>Building</button>
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
                        </div>
                    </div>
                ))}
            </div>

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

    );
}

export default Dashboard;