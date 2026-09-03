import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSignin = async () => {

        try {

            const response = await fetch(
                'http://localhost:5000/api/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            setMessage(data.message);

            if (response.ok) {

                console.log(data);

                localStorage.setItem('token', data.token);

                localStorage.setItem(
                    'user',
                    JSON.stringify(data.user)
                );

                navigate('/');
            }

        } catch (error) {
            console.log(error);
        }
    };

    return (

        <div className="login-page">

    <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
            Login to your image gallery
        </p>

        <input
            className="login-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button
            className="login-button"
            onClick={handleSignin}
        >
            Login
        </button>

        <p className="login-message">
            {message}
        </p>

        <p className="login-switch">
            Don't have an account?

            <span onClick={() => navigate('/signup')}>
                Sign up
            </span>
        </p>

    </div>

</div>
    );
};

export default Login;