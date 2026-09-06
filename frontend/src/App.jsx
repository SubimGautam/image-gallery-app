// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Gallery from './pages/Gallery/Gallery';
import Signup from './pages/Signup/Signup';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    );
}

export default App;