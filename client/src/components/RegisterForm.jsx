import React, {useState} from 'react';
import styles from '../styles/Home.module.css';
import Message from './Message';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

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

                const responseJson = await response.json();
                const errorMessage = responseJson.error;
                setMessage(errorMessage);
                setType("error")
            }
            else{
                setMessage('Registered successfully!');
                setType("success")
                console.log('User registered successfully!');
                setName('');
                setEmail('');
                setPassword('');}


        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setType("error")
            console.error('Error registering user:', error.message);
        }
    };

    return (
        <>
            <div className={styles.main}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
            </div>
            <div >
                <Message type={type} text={message}/>
            </div>
        </>
    );
};

export default RegisterForm;
