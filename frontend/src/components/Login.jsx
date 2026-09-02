import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignin = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        setMessage(data.message);

        if (response.ok) {
            navigate('/dashboard');
        }

    } catch (error) {
        console.log(error);
    }
};

    return (
        <div>
            <h1>Login</h1>

            <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleSignin}>
                Login
            </button>

            <p>{message}</p>
        </div>
    );
};

export default Login;