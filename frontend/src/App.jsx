// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Gallery from './pages/Gallery/Gallery';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import Chat from './pages/Chat/Chat';
import Landing from './pages/Landing/Landing';
import Inbox from './pages/Inbox/Inbox';
import Settings from './pages/Settings/Settings';

function App() {
    return (
        <Routes>
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/messages" element={<Inbox />} />
            <Route path="/messages/:userId" element={<Inbox />} />  
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile/:id" element={<Profile />} />
        </Routes>
    );
}

export default App;