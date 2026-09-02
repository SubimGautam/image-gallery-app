// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Gallery from './components/Gallery';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

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