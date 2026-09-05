import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    return (
        <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
            <button className='sidebar-toggle' onClick={() => setSidebarOpen(!sidebarOpen)}>
                ☰
            </button>

            <nav className='sidebar-nav'>
                <button className='sidebar-link' onClick={() => navigate('/')}>
                    <span className='sidebar-icon'>🖼️</span>
                    <span className='sidebar-label'>Gallery</span>
                </button>
            </nav>
        </aside>
    );
};

export default Sidebar;