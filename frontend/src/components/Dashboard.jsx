import React, { useEffect, useState } from 'react';

const Dashboard = () => {

    const [totalImages, setTotalImages] = useState(0);
    useEffect(() => {  // Run this code when the Dashboard component loads.
        const getDashboardData = async () => {
            try{
                const response = await fetch('http://localhost:5000/api/dashboard') // This is where React communicates with Express.
                const data = await response.json();
                setTotalImages(data.totalImages)
            }catch (error){
            console.log(error);
            }
        };
        getDashboardData(); // Get dashboard information from our backend.                                                                                                                             
    },[]);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to Dashboard</p>
        </div>
    );
};

export default Dashboard;