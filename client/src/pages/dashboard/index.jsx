import {useEffect, useState} from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const Page = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('authToken');
                console.log("token", storedToken)
                if (storedToken) {
                    setToken(storedToken);
                }
                const response = await fetch(`${BASE_URL}/dashboard/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });

                if (!response.ok) {
                    const responseJson = await response.json();
                    const errorMessage = responseJson.error;
                    setMessage(errorMessage);
                    setType("error");
                } else {
                    const responseJson = await response.json();
                    const redirect = responseJson.redirect;
                    setMessage('Hi');
                    setType("success");
                    console.log('Dashboard');
                }
            } catch (error) {
                setMessage(`Error: ${error.message}`);
                setType("error");
                console.error('Error fetching dashboard data:', error.message);
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures useEffect runs only once

    return (
        <div>
            <div>Hello</div>
        </div>
    );
};

export default Page;
