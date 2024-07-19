import {useRouter} from 'next/router';
import {useContext, useEffect, useRef, useState} from "react";
import Tiptap from '../../../components/Tiptap'
import {Box, Button} from '@mui/material';
import {NotesContext, NotesContextProvider} from '@/components/MyContext';
import {AwesomeButton} from "react-awesome-button";
import 'react-awesome-button/dist/styles.css';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const ProjectPage = () => {
  // const notesFromContext = useContext(NotesContext);//todo wrong, i mean this aint the global one
  // const [notes, setNotes] = useState(notesFromContext);// todo wrong
  const {notes, setNotes, getLatestNotes} = useContext(NotesContext);

  const pagesRef = useRef([
	{id: 1, content: 'Page 1 content'},
	{id: 2, content: 'Page 2 content'},
	{id: 3, content: 'Page 3 content'}
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageId, setPageId] = useState(0);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [pages, setPages] = useState(null);
  const [content, setContent] = useState('');
  const contentRef = useRef('');
  const router = useRouter();
  const {prj_id} = router.query;//gets the url and finds the dynamic id//NEED CURLY BRACES TO DESTRUCT


  const handleContentChange = (reason) => {
	setContent(reason)
  }

  const appendPage = (newPage) => {
	const currentPages = pagesRef.current;
	if (Array.isArray(currentPages)) {
	  const newPages = [...currentPages, newPage];
	  pagesRef.current = newPages;
	  setPages(newPages);
	}
  };

  const updatePageContent = (index, newContent) => {
	const currentPages = pagesRef.current;
	if (Array.isArray(currentPages) && index >= 0 && index < currentPages.length) {
	  const newPages = [...currentPages];
	  newPages[index] = {...newPages[index], content: newContent};
	  pagesRef.current = newPages;
	  setPages(newPages);
	}
	console.log("pagesRef.current", pagesRef.current);
  };

  const handlePrevious = () => {
	handleSave();
	console.log("pagesREEEFF", pagesRef.current[pageIndex].id);
	contentRef.current = pagesRef.current[pageIndex - 1].content;
	setPageId(pagesRef.current[pageIndex - 1].id);
	setContent(contentRef.current);
	console.log("handle prev called", contentRef.current, content);
	setPageIndex((prev) => prev - 1);
  };

  const handleNext = () => {
	handleSave();
	contentRef.current = pagesRef.current[pageIndex + 1].content;
	setPageId(pagesRef.current[pageIndex + 1].id);
	setContent(contentRef.current);
	console.log("handle next called", contentRef.current, content);
	setPageIndex((prev) => prev + 1);
  };

  const handlePageCreation = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/page/`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},
		body: JSON.stringify({project: prj_id}),
	  });
	  if (!response.ok) {
		//const responseJson = await response.json();
		//const errorMessage = responseJson.error;
	  } else {
		console.log("created page");
		const responseJson = await response.json();
		console.log(responseJson);
		appendPage(responseJson);//todo check
		// pages.current = [...pages, responseJson];
		setTotalPageCount((prev) => prev + 1);
		setPageIndex((prev) => prev + 1);
		contentRef.current = responseJson.content;
		setPageId(pagesRef.current[pagesRef.current.length - 1].id);
		setContent(responseJson.content);
		setNotes([]);
	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  };


  const handleSave = async () => {
	updatePageContent(pageIndex, content);
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/page/${pages[pageIndex].id}/`, {
		method: 'PATCH',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},
		body: JSON.stringify({content}),
	  });
	  if (!response.ok) {
		//const responseJson = await response.json();
		//const errorMessage = responseJson.error;
	  } else {
		console.log("succesfully updated content");
		const responseJson = await response.json();
		console.log(responseJson);
	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  };

  const getNotesOfThePage = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/page/${pagesRef.current[pageIndex].id}/`, {
		method: 'GET',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},

	  });
	  if (!response.ok) {
		console.log("there is no note");
	  } else {
		console.log("succesfully fetched notes");
		const responseJson = await response.json();
		setNotes(responseJson.notes);

	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  }


  useEffect(() => {
	setContent(contentRef.current);
	console.log("pageIndex updated,", content);
	console.log("allnotes prj effect", notes);

	getNotesOfThePage();

  }, [pageIndex]);

  useEffect(() => {
	(async () => {
	  try {
		const storedToken = localStorage.getItem('authToken');
		const response = await fetch(`${BASE_URL}/dashboard/${prj_id}/`, {
		  method: 'GET',
		  headers: {
			'Content-Type': 'application/json',
			Authorization: `Token ${storedToken}`,
		  },
		});
		if (!response.ok) {
		  //const responseJson = await response.json();
		  //const errorMessage = responseJson.error;
		} else {
		  console.log("succes");
		  const responseJson = await response.json();

		  //setCurrentPageID(responseJson.pages[pageIndex].id);
		  contentRef.current = responseJson.pages[pageIndex].content;
		  setContent(responseJson.pages[pageIndex].content);
		  setPages(responseJson.pages);
		  pagesRef.current = responseJson.pages;
		  setPageId(pagesRef.current[pageIndex].id);
		  setTotalPageCount(responseJson.total_page_count);
		  getNotesOfThePage();
		}
	  } catch (error) {
		console.log("err yedük yakala", error);
	  }
	})();

  }, [prj_id]);

  if (!content) {
	return null;
  }

  console.log("allnotes prj", notes);
  return (
	<div>

	  <AwesomeButton
		onPress={() => {
		  router.push('/dashboard/');
		}} //maybe projelerin hepsinin olduğu yan menü olur
		type="secondary"
		style={{
		  position: "absolute",
		  top: "10%",
		  left: "3%",
		  buttonPrimaryColor: "#230a10",
		  height: "40px",
		  width: "100px",
		  fontSize: "16px",
		  borderRadius: "10px",
		  primaryColor: "#00000"
		}}
	  >
		⬅Projects
	  </AwesomeButton>
	  <Tiptap content={content}
			  onChange={(newContent) => handleContentChange(newContent)}
			  pageIndex={pageIndex}
			  pageId={pageId}
			  totalPageCount={totalPageCount}
			  onSave={handleSave}
			  showAddButton={pageIndex + 1 === totalPageCount}
			  showPreviousButton={pageIndex !== 0}
			  onAddButtonClick={handlePageCreation}
			  onNextButtonClick={handleNext}
			  onPreviousButton={handlePrevious}/>

	</div>
  );
};

export default ProjectPage;
