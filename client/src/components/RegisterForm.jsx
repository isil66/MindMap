import React, { useState } from 'react';
import styles from '../styles/Home.module.css';
import Message from './Message';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const RegisterForm = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            username,
            email,
            password,
        };

        try {
            const response = await fetch(`${BASE_URL}/register/`, {
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
            } else {
                const responseJson = await response.json();
                const redirect = responseJson.redirect;
                const token = responseJson.token;
                localStorage.setItem('authToken', token);
                setMessage('Registered successfully!');
                setType("success")
                console.log('User registered successfully!');
                setUsername('');
                setEmail('');
                setPassword('');
                await router.push(redirect);
            }


        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setType("error")
            console.error('Error registering user:', error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
    <>
      <div className={styles.main}>
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px' }}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <div className="input-group">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      </div>
      <div>
        <Message type={type} text={message} />
      </div>
    </>
  );
};

export default RegisterForm;