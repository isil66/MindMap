import React, {useEffect, useState} from 'react';
import Message from '@/components/Message';
import FolderIconSvg from '../../../public/folder-svgrepo-com.svg';
import Image from 'next/image';
import {Grid, Paper, Button, Stack, TextField} from '@mui/material';
import {createSvgIcon} from '@mui/material/utils';
import style from '../../styles/FolderIcon.module.css'
import {useRouter} from 'next/router';


const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const PlusIcon = createSvgIcon(
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
    </svg>,
    'Plus',
);

const FolderIcon = ({project}) => {
    const router = useRouter();
    const handleClick = () => {
        router.push('/register/'); //todo get the prj link: user bu projeye sahip mi diye bak backende tokenden
    };
    console.log(project)
    return (
        <div className={style.folderIconContainer} onClick={handleClick}>
            <FolderIconSvg/>
            <div className={style.overlayTextCreationDate}>{project["prj_name"]}</div>
        </div>
    );
};


const Page = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState('');
    const [createOn, setCreateOn] = useState(false);

    const fetchData = async () => {
        try {
            const storedToken = localStorage.getItem('authToken');

            const response = await fetch(`${BASE_URL}/dashboard/`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${storedToken}`,
                },
            });

            if (!response.ok) {
                const responseJson = await response.json();
                const errorMessage = responseJson.error;
                setMessage(errorMessage);
                setType('error');
            } else {
                const responseJson = await response.json();
                setMessage('Successfully fetched dashboard data');
                setType('success');
                setProjects(responseJson); // Assuming responseJson is an array of project objects
                console.log('Dashboard data:', responseJson);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setType('error');
            console.error('Error fetching dashboard data:', error.message);
        }
    };

    const handleCreateProject = async () => {
        if (!newProjectName) {
            setMessage('Project name cannot be empty');
            setType('error');
            return;
        }

        try {
            const storedToken = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/dashboard/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${storedToken}`,
                },
                body: JSON.stringify({prj_name: newProjectName, creation_date: new Date().toISOString().split('T')[0]}),
            });

            if (!response.ok) {
                const responseJson = await response.json();
                const errorMessage = responseJson.error;
                setMessage(errorMessage);
                setType('error');
            } else {
                setMessage('Project created successfully');
                setType('success');
                setNewProjectName('');
                fetchData(); // Fetch updated projects
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
            setType('error');
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array ensures useEffect runs only once

    return (
        <div>
            <Stack direction="row" spacing={5} alignItems="flex-start" justifyContent="center">
                <h1>Dashboard</h1>
                <Button variant="contained" href="#contained-buttons" size="large" endIcon={<PlusIcon/>}
                        onClick={() => {
                            setCreateOn(!createOn)
                        }}>
                    New Project
                </Button>
            </Stack>

            <Grid container justifyContent="right" alignItems="flex-end" spacing={{xs: 2, md: 1}}
                  columns={{xs: 4, sm: 8, md: 8}}>
                {projects.map((project, index) => (
                    <Grid item key={index} xs={12} sm={6} md={3} lg={3}>
                        <FolderIcon project={project}/>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Page;
