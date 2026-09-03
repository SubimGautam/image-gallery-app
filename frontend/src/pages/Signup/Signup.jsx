import React, {useState} from 'react'
import './Signup.css'

const Signup = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try{
            const response = await fetch ('http://localhost:5000/api/signup',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });
            const data = await response.json();
            console.log("Backend response:", data);
            console.log(data);
        } catch(error) {
            console.log(error)
        }
    }

    return(
        <div className="signup-page">

    <div className="signup-card">

        <h1>Sign up</h1>

        <input
            className="signup-input"
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />

        <input
            className="signup-input"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <input
            className="signup-input"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button
            className="signup-button"
            onClick={handleSignup}
        >
            Signup
        </button>

    </div>

</div>
    )
}

export default Signup