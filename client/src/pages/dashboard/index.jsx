import React, {useContext, useEffect, useRef, useState} from 'react';
import Message from '@/components/Message';
import FolderIconSvg from '../../../public/folder-svgrepo-com.svg';
import {
  Grid,
  Button,
  Stack,
  TextField,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {createSvgIcon} from '@mui/material/utils';
import style from '../../styles/FolderIcon.module.css';
import {useRouter} from 'next/router';
import {AwesomeButton} from "react-awesome-button";


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

const FolderIcon = ({project, onRightClick}) => {
  const router = useRouter();
  const prj_id = project['id'];

  const handleClick = () => {
	router.push(`/dashboard/project/${prj_id}/`);
  };

  const handleRightClick = (event) => {
	event.preventDefault();
	onRightClick(event, project);
  };

  return (
	<div className={style.folderIconContainer} onClick={handleClick} onContextMenu={handleRightClick}>
	  <FolderIconSvg/>
	  <div className={style.overlayTextCreationDate}>{project['prj_name']}</div>
	</div>
  );
};

const Page = () => {
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [createOn, setCreateOn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renamedProjectName, setRenamedProjectName] = useState('');
  const router = useRouter();


  const fetchData = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');

	  const response = await fetch(`${BASE_URL}/dashboard/`, {
		method: 'GET',
		headers: {
		  Authorization: `Token ${storedToken}`,
		},
	  });
	  //burası resolve olana kadar bekliyor (fetch Promise'i resolve olana kadar)

	  if (!response.ok) {
		const responseJson = await response.json();
		const errorMessage = responseJson.error;
		setMessage(errorMessage);
		setType('error');
	  } else {
		const responseJson = await response.json();
		setMessage('Successfully fetched dashboard data');
		setType('success');
		console.log(responseJson.projects);
		setProjects(responseJson.projects);
		setTotalPageCount(responseJson.total_page_count);

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
		body: JSON.stringify({prj_name: newProjectName}),
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
		setCreateOn(false);
		fetchData();
	  }
	} catch (error) {
	  setMessage(`Error: ${error.message}`);
	  setType('error');
	}
  };

  const handleRightClick = (event, project) => {
	//event.currentTarget is the DOM element that was clickds
	setAnchorEl(event.currentTarget);
	setSelectedProject(project);
  };

  const handleCloseMenu = () => {
	setAnchorEl(null);
  };

  const handleRenameProject = () => {
	setRenamedProjectName(selectedProject.prj_name);
	setRenameDialogOpen(true);
	handleCloseMenu();
  };

  const handleDeleteProject = () => {
	setDeleteDialogOpen(true);
	handleCloseMenu();
  };

  const handleRenameSubmit = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/${selectedProject.id}/`, {
		method: 'PATCH',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},
		body: JSON.stringify({prj_name: renamedProjectName}),
	  });

	  if (!response.ok) {
		const responseJson = await response.json();
		const errorMessage = responseJson.error;
		setMessage(errorMessage);
		setType('error');
	  } else {
		setMessage('Project renamed successfully');
		setType('success');
		setRenameDialogOpen(false);
		fetchData();
	  }
	} catch (error) {
	  setMessage(`Error: ${error.message}`);
	  setType('error');
	}
  };

  const handleDeleteSubmit = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/${selectedProject.id}/`, {
		method: 'DELETE',
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
		setMessage('Project deleted successfully');
		setType('success');
		setDeleteDialogOpen(false);
		fetchData();
	  }
	} catch (error) {
	  setMessage(`Error: ${error.message}`);
	  setType('error');
	}
  };

  useEffect(() => {
	fetchData();

  }, []);


  return (
	<>
	  <AwesomeButton
		onPress={() => {
		  router.push(`/`);
		}}
		type="secondary"
		style={{
		  position: "absolute",
		  top: "20%",
		  left: "3%",
		  buttonPrimaryColor: "#230a10",
		  height: "40px",
		  width: "100px",
		  fontSize: "16px",
		  borderRadius: "10px",
		  primaryColor: "#00000"
		}}
	  >
		Logout
	  </AwesomeButton>
	  <Stack spacing={2}>
		<Box></Box>
		<Box></Box>

		<Box display="flex" justifyContent="center" alignItems="center">
		  <Box><Tooltip title={`You have a total of ${totalPageCount} pages in ${projects.length} projects`}>
			<h1>Dashboard</h1></Tooltip></Box>
		  <Box ml={2}>
			{!createOn ? (
			  <Button
				variant="contained"
				size="large"
				endIcon={<PlusIcon/>}
				onClick={() => {
				  setCreateOn(true);
				}}
			  >
				New Project
			  </Button>
			) : (
			  <Box
				sx={{
				  position: 'absolute',
				  top: '20%',
				  left: '50%',
				  transform: 'translate(-50%, -50%)',
				  bgcolor: 'background.paper',
				  boxShadow: 24,
				  p: 4,
				  borderRadius: 1,
				  zIndex: 1300,
				}}
			  >
				<Stack direction="column" spacing={2} alignItems="center">
				  <TextField
					id="outlined-basic"
					label="Name of your new project"
					variant="outlined"
					value={newProjectName}
					size="small"
					onChange={(e) => setNewProjectName(e.target.value)}
				  />
				  <Stack direction="row" spacing={2} alignItems="center">
					<Button variant="contained" size="small" onClick={handleCreateProject}>
					  Create
					</Button>
					<Button variant="text" size="small" onClick={() => setCreateOn(false)}>
					  Cancel
					</Button>
				  </Stack>
				</Stack>
			  </Box>
			)}
		  </Box>
		</Box>
		<Grid container justifyContent="right" alignItems="flex-end" spacing={{xs: 2, md: 1}}
			  columns={{xs: 4, sm: 8, md: 8}}>
		  {projects.map((project, index) => (
			<Grid item key={index} xs={12} sm={6} md={3} lg={3}>
			  <FolderIcon project={project} onRightClick={handleRightClick}/>
			</Grid>
		  ))}
		</Grid>
		<Menu
		  anchorEl={anchorEl}
		  open={Boolean(anchorEl)}
		  onClose={handleCloseMenu}
		  PaperProps={{
			style: {
			  maxHeight: 48 * 4.5,
			  width: '20ch',
			},
		  }}
		>
		  <MenuItem onClick={handleRenameProject}>Rename</MenuItem>
		  <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
		</Menu>


		<Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)}>
		  <DialogTitle>Rename Project</DialogTitle>
		  <DialogContent>
			<TextField
			  autoFocus
			  margin="dense"
			  id="newProjectName"
			  label="New Project Name"
			  type="text"
			  fullWidth
			  value={renamedProjectName}
			  onChange={(e) => setRenamedProjectName(e.target.value)}
			/>
		  </DialogContent>
		  <DialogActions>
			<Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
			<Button onClick={handleRenameSubmit} color="primary">Rename</Button>
		  </DialogActions>
		</Dialog>

		<Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
		  <DialogTitle>Confirm Delete</DialogTitle>
		  <DialogContent>
			<DialogContentText>
			  Are you sure you want to delete the project {selectedProject?.prj_name}?
			</DialogContentText>
		  </DialogContent>
		  <DialogActions>
			<Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
			<Button onClick={handleDeleteSubmit} color="primary">Delete</Button>
		  </DialogActions>
		</Dialog>
	  </Stack>
	</>
  );
};

export default Page;
