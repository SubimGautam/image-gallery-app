import React, { useEffect, useState } from 'react';

const Dashboard = () => {

    const [totalImages, setTotalImages] = useState(0);
    useEffect(() => {
        const getDashboardData = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/dashboard')
                const data = await response.json();
                setTotalImages(data.totalImages)
            }catch (error){
            console.log(error);
            }
        };
        getDashboardData();
    },[]);
    
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Dashboard</p>
        </div>
    );
};

export default Dashboard;