import React, { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import Filters from '../../components/Filters/Filters';
import ImageCard from '../../components/ImageCard/ImageCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar'
const Dashboard = () => {

    const [publicImages, setPublicImages] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [category, setCategory] = useState('All');
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [savedIds, setSavedIds] = useState([]);
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

    const handleSaveToggle = async (image) => {
    const token = localStorage.getItem('token');
    const isCurrentlySaved = savedIds.includes(image._id);
    const action = isCurrentlySaved ? 'unsave' : 'save';

    try {
        const response = await fetch(`http://localhost:5000/api/images/${image._id}/${action}`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
            if (isCurrentlySaved) {
                setSavedIds(savedIds.filter((id) => id !== image._id));
            } else {
                setSavedIds([...savedIds, image._id]);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

    const filterImages = publicImages.filter((image) =>
        (image.author || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || image.uploadcategory === category)
    );

    return(

    <div className='dashboard-layout'>

        <Sidebar />

        <div className='dashboard-main'>
            <Navbar search={search} onSearchChange={setSearch} searchUsers={true} />
            <Filters category={category} onCategoryChange={setCategory} />

            <div className='gallery-images'>
                {filterImages.map((image) => (
                    <ImageCard
                        key={image._id}
                        image={image}
                        onPreview={setPreviewImage}
                        showDownload={true}
                        onSave={handleSaveToggle}
                        isSaved={savedIds.includes(image._id)}
                    />
                ))}
            </div>

            <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
        </div>
    </div>
    

    );
}

export default Dashboard;