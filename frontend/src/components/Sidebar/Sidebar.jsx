import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import HomeIcon from '../../assets/home.png';
import GalleryIcon from '../../assets/gallery.png';
import MessageIcon from '../../assets/message.png';
import SettingsIcon from '../../assets/settings.png';
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
                <button className='sidebar-link' onClick={() => navigate('/gallery')}>
                    <img src={GalleryIcon} alt="Gallery" />
                </button>
                <button className='sidebar-link' onClick={() => navigate('/messages')}>
                    <img src={MessageIcon} alt="Messages" />
                </button>
            </nav>

            <button className='sidebar-link sidebar-settings' onClick={() => navigate('/settings')}>
                <img src={SettingsIcon} alt="Settings" />
            </button>
        </aside>
    );
};

export default Sidebar;