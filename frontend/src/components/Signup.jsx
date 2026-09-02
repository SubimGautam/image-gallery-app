import React, {useState} from 'react'

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
        <div>
            <h1>Sign up</h1>
            <input 
            type='text'
            placeholder='name'
            value={name}
            onChange={(e)=> setName(e.target.value)}
            />

            <input 
            type='email'
            placeholder='email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            />

            <input 
            type='password'
            placeholder='password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            />
            <button onClick={handleSignup}>
                Signup
            </button>
        </div>
    )
}

export default Signup