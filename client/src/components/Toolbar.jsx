"use client";

import React, {useState, useEffect, useRef, useContext} from "react";
import {Editor} from "@tiptap/react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import styles from "../styles/Tiptap.module.css";
import {
  Bold,
  Strikethrough,
  Highlighter,
  StickyNote,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Underline,
  Heading1,
  Undo,
  Redo,
  Code
} from "lucide-react";
import {NotesContext} from "@/components/MyContext";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const Toolbar = ({
				   editor,
				   content,
				   pageId,
				   positionTextField,
				   isTextFieldShown,
				   setIsTextFieldShown,
				   textFieldPlacement,
				   noteContent,
				   setNoteContent,
				   noteIdToEdit,
				   setNoteIdToEdit
				 }) => {
  const noteIdRef = useRef(0);
  const takeNoteRef = useRef(true);
  const fromRef = useRef(0);
  const toRef = useRef(0);
  const noteRef = useRef({page: -1, content: "test"})
  const [note, setNote] = useState({page: -1, content: "test"});
  const {notes, setNotes, getLatestNotes} = useContext(NotesContext);//doğru

  console.log("hepsi:", notes);
  console.log("noteidref", noteIdRef.current);

  const saveNote = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/page/notes/`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		  Authorization: `Token ${storedToken}`,
		},
		body: JSON.stringify({page: pageId, content: noteContent}),
	  });
	  if (response.ok) {
		const responseJson = await response.json();
		console.log("success of post note id:", responseJson.id);
		noteRef.current = {
		  id: responseJson.id,
		  content: responseJson.content,
		}
		setNotes((prevNotes) => {
		  console.log("prevnotes", prevNotes);
		  return [...notes, noteRef.current]
		});

	  } else {
		console.log("HTTP error", response.status, response.statusText);
	  }
	} catch (error) {
	  console.error('Error fetching dashboard data:', error.message);
	}
  };

  const getNoteIdStartingPoint = async () => {
	try {
	  const storedToken = localStorage.getItem('authToken');
	  const response = await fetch(`${BASE_URL}/dashboard/page/notes/`, {
		method: 'GET',
		headers: {
		  Authorization: `Token ${storedToken}`,
		},
	  });
	  if (response.ok) {
		const responseJson = await response.json();
		noteIdRef.current = responseJson.largest_current_note_id;
	  }
	} catch (error) {
	  console.error('Error fetching dashboard data:', error.message);
	}
  };

  useEffect(() => {
	if (isTextFieldShown) {
	  editor.commands.blur();
	}
  }, [isTextFieldShown]);

  useEffect(() => {
	getNoteIdStartingPoint();
  }, []);

  if (!editor) {
	return null;
  }

  const decrementNoteId = () => {
	noteIdRef.current--;
  }

  const handleClickTakeNoteStart = (e) => {
	fromRef.current = editor.state.selection['ranges'][0]['$from']['pos'];
	e.preventDefault();
	takeNoteRef.current = false;
	const newNoteId = noteIdRef.current + 1;
	noteIdRef.current = newNoteId;
	editor.chain().focus().toggleHighlight({color: "#500bb6", note_id: newNoteId}).run(); // Add color options
  };

  const handleClickTakeNoteEnd = (e) => {
	toRef.current = editor.state.selection['ranges'][0]['$to']['pos'];
	e.preventDefault();
	takeNoteRef.current = true;
	editor.chain().focus().toggleHighlight({color: "#500bb6", note_id: noteIdRef.current}).run();
	positionTextField();
  };

  const selectToTakeNote = (e) => {
	const newNoteId = noteIdRef.current + 1;
	noteIdRef.current = newNoteId;
	toRef.current = editor.state.selection['ranges'][0]['$to']['pos'];
	fromRef.current = editor.state.selection['ranges'][0]['$from']['pos'];
	console.log("selection note id to be", newNoteId);
	editor.chain().focus().toggleHighlight({color: "#500bb6", note_id: newNoteId}).run();
	positionTextField();
  };

  const handleNoteToggles = (e) => {

	if (editor.state.selection['ranges'][0]['$to']['pos']
	  !== editor.state.selection['ranges'][0]['$from']['pos']) {
	  selectToTakeNote(e);
	} else if (takeNoteRef.current) {
	  handleClickTakeNoteStart(e);
	} else {
	  handleClickTakeNoteEnd(e);
	}
  };

  function closeTextField() {
	setIsTextFieldShown(false);
	setNoteContent('');
  }

  const saveEdit = async (noteId) => {
	// try {
	//   const storedToken = localStorage.getItem('authToken');
	//   const response = await fetch(`${BASE_URL}/dashboard/page/notes/${noteId}`, {
	// 	method: 'PATCH',
	// 	headers: {
	// 	  'Content-Type': 'application/json',
	// 	  Authorization: `Token ${storedToken}`,
	// 	},
	// 	body: JSON.stringify({page: pageId, content: noteContent}),
	//   });
	//   if (response.ok) {
	// 	const responseJson = await response.json();
	// 	console.log("success of save note:", responseJson);
	// 	noteRef.current = {
	// 	  id: responseJson.id,
	// 	  content: responseJson.content,
	// 	}
	// 	setNotes((prevNotes) => {
	// 	  console.log("prevnotes", prevNotes);
	// 	  return [...notes, noteRef.current]
	// 	});
	//   } else {
	// 	console.log("HTTP error", response.status, response.statusText);
	//   }
	//   closeTextField();
	//	 setNoteIdToEdit(null);
	// } catch (error) {
	//   console.error('Error saving edit:', error.message);
	// }
	console.log("TOOLBAR SAVE EDİT", noteIdToEdit);
  }


  const handleCancel = () => {
	closeTextField();
	editor.commands.setTextSelection({from: fromRef.current, to: toRef.current});
	editor.chain().focus().unsetHighlight().run();
	decrementNoteId();
	console.log("handle initial cancel")
  };

  const handleSave = () => {
	saveNote();
	closeTextField();
  };

  const buttonStyle = {
	margin: "5px",
	color: "#621d9a",
  };

  return (
	<div>
	  <div style={{display: "flex", justifyContent: "center", margin: "10px 0"}} className={styles.toolbar}>
		<Tooltip title="Bold" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleBold().run();
			}}>
			<Bold/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Italic" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleItalic().run();
			}}>
			<Italic/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Underline" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleUnderline().run();
			}}>
			<Underline/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Strikethrough" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleStrike().run();
			}}>
			<Strikethrough/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Highlight" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleHighlight().run();
			}}>
			<Highlighter/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Take Note" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={handleNoteToggles}>
			<StickyNote/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Heading 1" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleHeading({level: 1}).run();
			}}>
			<Heading1/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Heading 2" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleHeading({level: 2}).run();
			}}>
			<Heading2/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Heading 3" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleHeading({level: 3}).run();
			}}>
			<Heading3/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Bullet List" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleBulletList().run();
			}}>
			<List/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Ordered List" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().toggleOrderedList().run();
			}}>
			<ListOrdered/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Code" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().setCode().run();
			}}>
			<Code/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Undo" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().undo().run();
			}}>
			<Undo/>
		  </IconButton>
		</Tooltip>
		<Tooltip title="Redo" placement="top">
		  <IconButton
			style={buttonStyle}
			onClick={(e) => {
			  e.preventDefault();
			  editor.chain().focus().redo().run();
			}}>
			<Redo/>
		  </IconButton>
		</Tooltip>
	  </div>
	  {isTextFieldShown && (
		<div style={{
		  position: 'absolute',
		  top: textFieldPlacement.top,
		  left: textFieldPlacement.left,
		  zIndex: 1000,
		  background: '#fff',
		  padding: '10px',
		  borderRadius: '5px',
		  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
		}}
		>
		  <TextField
			label="Take a note..."
			multiline
			rows={4}
			variant="outlined"
			value={noteContent}
			onChange={(e) => setNoteContent(e.target.value)}
			style={{width: '300px'}}
		  />
		  <div style={{marginTop: '10px', textAlign: 'right'}}>
			<Button
			  onClick={() =>
				(noteIdToEdit !== null
				  ? closeTextField()
				  : handleCancel())
			  }
			  style={{marginRight: '10px'}}
			>
			  Cancel
			</Button>
			<Button
			  onClick={() =>
				(noteIdToEdit !== null
				? saveEdit(noteIdToEdit)
				: handleSave())
			  }
			  variant="contained"
			  color="primary"
			>
			  Save
			</Button>
		  </div>
		</div>
	  )}
	</div>
  );
};

export default Toolbar;
