import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./Auth.css";

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

        <div className="auth-page">

            <div className="auth-card">

                <h1>Welcome Back</h1>

                <p className="auth-subtitle">
                    Login to your image gallery
                </p>

                <input
                    className="auth-input"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="auth-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="auth-button"
                    onClick={handleSignin}
                >
                    Login
                </button>

                <p className="auth-message">
                    {message}
                </p>

                <p className="auth-switch">
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