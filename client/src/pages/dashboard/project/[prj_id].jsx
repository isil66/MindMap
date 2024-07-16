import {useRouter} from 'next/router';
import {useContext, useEffect, useRef, useState} from "react";
import Tiptap from '../../../components/Tiptap'
import {Box, Button} from '@mui/material';
import {NotesContext} from '@/components/MyContext';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;



const ProjectPage = () => {
  const notesFromContext = useContext(NotesContext);
  const [notes, setNotes] = useState(notesFromContext);

  const pagesRef = useRef([
	{id: 1, content: 'Page 1 content'},
	{id: 2, content: 'Page 2 content'},
	{id: 3, content: 'Page 3 content'}
  ]);
  const [pageIndex, setPageIndex] = useState(0);
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
	console.log("Array.isArray(currentPages)", Array.isArray(currentPages));
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
	contentRef.current = pagesRef.current[pageIndex - 1].content;
	setContent(contentRef.current);
	console.log("handle prev called", contentRef.current, content);
	setPageIndex((prev) => prev - 1);
  };

  const handleNext = () => {
	handleSave();
	contentRef.current = pagesRef.current[pageIndex + 1].content;
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
		setContent(responseJson.content);
	  }
	} catch (error) {
	  console.log("err yedük yakala", error);
	}
  };

  // const updatePageContent = (index, newContent) => {
  //     const newPages = [...pages.current];
  //     console.log("newpages1", newPages);
  //     if (index >= 0 && index < newPages.length) {
  //         newPages[index] = {...newPages[index], content: newContent};
  //         pages.current = newPages;
  //     }
  //     console.log("newpages2", pages.current);
  // };

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

  //An async function is really just syntax sugar for promises,
  // so when you call an async function, it's returning a promise.
  //But in useEffect u need to give it a function in this form () => {function();};
  //nstead, you can wrap your async function with an IIFE (Immediately-invoked Function Expression) like this,
  // so nothing is returned to useEffect and used as a cleanup function:
  //useEffect(() => {
  //   (async () => getResponse())();
  // });
  useEffect(() => {

	setContent(contentRef.current);
	console.log("pageIndex updated,", content);
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
		  console.log(responseJson);
		  console.log("anaam", responseJson.pages[pageIndex].content)
		  console.log("babam", responseJson.pages[pageIndex].id)
		  //setCurrentPageID(responseJson.pages[pageIndex].id);
		  contentRef.current = responseJson.pages[pageIndex].content;
		  setContent(responseJson.pages[pageIndex].content);
		  setPages(responseJson.pages);
		  pagesRef.current = responseJson.pages;
		  setTotalPageCount(responseJson.total_page_count);
		}
	  } catch (error) {
		console.log("err yedük yakala", error);
	  }
	})();
  }, [prj_id]);

  if (!content) {
	return null;
  }

  return (
	<div>
	  <NotesContext.Provider value={{notes, setNotes}}>
		<Tiptap content={content}
				onChange={(newContent) => handleContentChange(newContent)}
				pageIndex={pageIndex} totalPageCount={totalPageCount} onSave={handleSave}
				showAddButton={pageIndex + 1 === totalPageCount} showPreviousButton={pageIndex !== 0}
				onAddButtonClick={handlePageCreation} onNextButtonClick={handleNext}
				onPreviousButton={handlePrevious}/>
	  </NotesContext.Provider>

	</div>)
};
export default ProjectPage;