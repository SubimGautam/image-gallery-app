import React, { useEffect, useState } from 'react';
import '../../components/Gallery/Gallery.css';
const Dashboard = () => {

    const [publicImages, setPublicImages] = useState([]);
    useEffect(() => {
        const getPublicImages = async () => {
            try{
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/images/public', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                console.log('Public Images: ', data);
                setPublicImages(data);
            } catch (error){
                console.log(error);
            }
        };
        getPublicImages();
    },[]);
    return(
    <div>
        <h1>Welcome to dashboard</h1>

        <div className='gallery-images'>
            {publicImages.map((image) => (
                <div className='image-card' key={image._id}>
                    <div className='image-frame'> 
                        <img 
                            src={`http://localhost:5000${image.imageUrl}`}
                            alt={image.author}
                        />
                    </div>
                    <div className='image-info'> 
                        <h3>{image.title || 'Untitled'}</h3>
                        <p>{image.author || 'Unknown'}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

export default Dashboard;