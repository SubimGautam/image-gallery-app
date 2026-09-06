import React, { useEffect, useState } from 'react';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import PreviewModal from '../../components/PreviewModal/PreviewModal';
import Filters from '../../components/Filters/Filters';
import ImageCard from '../../components/ImageCard/ImageCard';
import Sidebar from '../../components/Sidebar/Sidebar';
import SearchBar from '../../components/SearchBar/SearchBar';
const Dashboard = () => {

    const [publicImages, setPublicImages] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [category, setCategory] = useState('All');
    const [sidebarOpen, setSideBarOpen] = useState(false);
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

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
        (image.author || '').toLowerCase().includes(search.toLowerCase()) &&
        (category === 'All' || image.uploadcategory === category)
    );

    return(

    <div className='dashboard-layout'>

        <Sidebar />

        <div className='dashboard-main'>
            
            <SearchBar value={search} onChange={setSearch} />
            <Filters category={category} onCategoryChange={setCategory} />

            <div className='gallery-images'>
                {filterImages.map((image) => (
                    <ImageCard
                        key={image._id}
                        image={image}
                        onPreview={setPreviewImage}
                        showDownload={true}
                    />
                ))}
            </div>

            <PreviewModal image={previewImage} onClose={() => setPreviewImage(null)} />
        </div>
    </div>

    );
}

export default Dashboard;