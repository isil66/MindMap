import {useEffect, useState} from 'react';
import Message from "@/components/Message";
import Projects from "@/components/Project";
import FolderIconSvg from '../../../public/folder-svgrepo-com.svg';
import Image from "next/image";
import style from "../../styles/FolderIcon.module.css"

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const FolderIcon = () => {
    return (
        <div className={style.folderIconContainer}>
            <FolderIconSvg/>
            <div className={style.overlayTextProjectName}>Prj</div>
             <div className={style.overlayTextCreationDate}>creation date: 04.07.2024</div>
        </div>
    );
};

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
            <div><Message type={type} text={message}/></div>
            <FolderIcon/>

        </div>
    );
};

export default Page;
