import {useRouter} from 'next/router';
import React, {useState} from 'react';
import {Button, TextField, Grid, Paper, Typography, IconButton, InputAdornment} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
const Login = () => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //submit diye başlı başına bir fonksiyonality olabilir
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            email,
            password,
        };

        try {
            const response = await fetch(`${BASE_URL}/login/`, {
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

    return (
        <Grid container justifyContent="center" alignItems="center" style={{height: '100vh'}}>
            <Grid item>
                <Paper style={{padding: '20px', maxWidth: '400px'}}>
                    <Typography variant="h5">Login</Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField label="Email" fullWidth margin="normal" value={email}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth style={{marginTop: '20px'}}>
                            Login
                        </Button>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Login;
