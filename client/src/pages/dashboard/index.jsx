import React, {useEffect, useState} from 'react';
import Message from '@/components/Message';
import FolderIconSvg from '../../../public/folder-svgrepo-com.svg';
import Image from 'next/image';
import {Grid, Paper, Button, Stack} from '@mui/material';
import {createSvgIcon} from '@mui/material/utils';
import style from '../../styles/FolderIcon.module.css'


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
    console.log(project)
    return (
        <div className={style.folderIconContainer}>
            <FolderIconSvg/>
            <div className={style.overlayTextCreationDate}>{project["prj_name"]}</div>
        </div>
    );
};

const Folder = ({project}) => {
    console.log(project)
    return (
        <Paper elevation={0} className={style.folderIconContainer}>
            <FolderIconSvg/>
            <div className={style.overlayTextProjectName}>{project["prj_name"]}</div>
            <div className={style.overlayTextCreationDate}>creation date: {project["creation_date"]}</div>
        </Paper>
    );
};

const Page = () => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [projects, setProjects] = useState([]);

    useEffect(() => {
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

        fetchData();
    }, []); // Empty dependency array ensures useEffect runs only once

    return (
        <div>
            <Stack direction="row" spacing={5}  alignItems="flex-start"  justifyContent="center">
                <h1>Dashboard</h1>
                <Button variant="contained" href="#contained-buttons" size="large" endIcon={<PlusIcon/>}>
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
