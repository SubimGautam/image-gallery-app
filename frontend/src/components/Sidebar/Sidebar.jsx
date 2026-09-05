import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import HomeIcon from '../../assets/home.png';
import GalleryIcon from '../../assets/gallery.png';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <aside className='sidebar'>
            <div className='sidebar-logo'>
                <img src={Logo} alt="Logo" />
            </div>

            <nav className='sidebar-nav'>
            <button className='sidebar-link' onClick={() => navigate('/dashboard')}>
                <img src={HomeIcon} alt="Home" />
            </button>
            <button className='sidebar-link' onClick={() => navigate('/')}>
                    <img src={GalleryIcon} alt="Gallery" />
            </button>
</nav>
        </aside>
    );
};

export default Sidebar;