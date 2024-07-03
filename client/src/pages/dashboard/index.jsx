import { useEffect, useState } from 'react';
import Message from "@/components/Message";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const Page = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedToken = localStorage.getItem('authToken');

                const response = await fetch(`${BASE_URL}/dashboard/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${storedToken}`
                    }
                });

                if (!response.ok) {
                    const responseJson = await response.json();
                    const errorMessage = responseJson.error;
                    setMessage(errorMessage);
                    setType("error");
                } else {
                    const responseJson = await response.json();
                    setMessage('Successfully fetched dashboard data');
                    setType("success");
                    console.log('Dashboard data:', responseJson);
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
            <h1>Dashboard</h1>
            <div><Message type={type} text={message} /></div>
        </div>
    );
};

export default Page;
