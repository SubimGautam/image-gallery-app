import React, { useEffect, useState } from 'react';

const Dashboard = () => {

    const [totalImages, setTotalImages] = useState(0);
    useEffect(() => {  // Run this code when the Dashboard component loads.
        const getDashboardData = async () => { // here we are creating a function called getDashboardData
            try{
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:5000/api/dashboard',{
                    headers: {
                        Authorization: `Bearer ${token}` // Bearer tells the server this value is an authentication server
                    }
                }); // This is where React communicates with Express.
                const data = await response.json(); // React receives the response
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