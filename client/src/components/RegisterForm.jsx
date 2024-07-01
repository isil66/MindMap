import React, {useState} from 'react';

export default function RegisterForm()
{
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //async because we use await inside to point to the django server
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            name,
            email,
            password,
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle success scenario (e.g., show success message)
            console.log('User registered successfully!');
        } catch (error) {
            // Handle error scenario (e.g., show error message)
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <br/>
            <label>
                Email:
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <br/>
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <br/>
            <button type="submit">Register</button>
        </form>
    );
}
