"use client";
import Head from "next/head";

import {useEditor, EditorContent, FloatingMenu} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CharacterCount from '@tiptap/extension-character-count';
import styles from "../styles/Tiptap.module.css";
import Paper from '@mui/material/Paper';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import {useContext, useEffect, useState} from "react";
import {Button, CircularProgress, IconButton, Typography} from "@mui/material";
import {useDebounce} from "@uidotdev/usehooks";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import useHoverOnMarks from './HoverOnMarks'
import HoverExtension from './HoverExtention'
import HoverExtensionWithNodeView from './HoverExtentionWithNodeView.jsx'
import {NotesContext} from "@/components/MyContext";

//No, you should be able to listen to mouseover and mouseout DOM events (via the handleDOMEvents prop
const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
const limit = 280;
const Tiptap = ({
				  onChange,
				  content,
				  pageIndex,
				  pageId,
				  totalPageCount,
				  onSave,
				  showPreviousButton,
				  showAddButton,
				  onAddButtonClick,
				  onNextButtonClick,
				  onPreviousButton,
				}) => {
  const {notes, setNotes, getLatestNotes} = useContext(NotesContext);
  const [editable, setEditable] = useState(true);//set editability for upcoming stuff
  const debounceContent = useDebounce(content, 5000);
  const [autosaveInProgress, setAutosaveInProgress] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [textFieldPosition, setTextFieldPosition] = useState({top: 0, left: 0});

  const handleChange = (newContent) => {
	console.log("content", content);
	onChange(newContent);
  };

  const showTextFieldAtCursor = (from = null, to = null, noteId = null) => {
	if (from === null || to === null) {
	  from = editor.state.selection.from;
	  to = editor.state.selection.to;
	}
	const start = editor.view.coordsAtPos(from);//prosemirror view api'ından bunlar
	const end = editor.view.coordsAtPos(to);

	const top = (start.top + end.top) / 2 - 30;
	const left = (start.left + end.left) / 2;
	setTextFieldPosition({top, left});
	setShowTextField(true);
  };


  const handleAutosave = () => {
	setAutosaveInProgress(true);
	setTimeout(() => {
	  setAutosaveInProgress(false);
	}, 2000);
  };


  useEffect(() => {
	if (editor) {
	  editor.commands.setContent(content);

	}
  }, [pageIndex]);

  useEffect(() => {
	onSave();
	handleAutosave();
  }, [debounceContent]);

  const CustomHighlight = Highlight.extend({
	addCommands() {
	  return {
		setHighlight: attributes => ({commands}) => {
		  return commands.setMark(this.name, attributes)
		},
		toggleHighlight: attributes => ({commands}) => {
		  return commands.toggleMark(this.name, attributes)
		},
		unsetHighlight: () => ({commands}) => {
		  return commands.unsetMark(this.name)
		},
	  }
	},

	addStorage() {
	  return {
		note_id: 0,
	  }
	},
	onUpdate() {
	  this.storage.note_id += 1
	},
	addOptions() {
	  return {
		multicolor: true,
		HTMLAttributes: {},
	  }
	},
	addAttributes() {
	  return {
		note_id: {
		  default: this.storage.note_id,
		},
		color: {
		  default: null,
		  parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
		  renderHTML: attributes => {
			if (!attributes.color) {
			  return {}
			}

			return {
			  'data-color': attributes.color,
			  style: `background-color: ${attributes.color}; color: inherit`,
			}
		  },
		},
	  }
	},
  });

  const editor = useEditor({
	editable,
	extensions: [StarterKit, HoverExtension({
	  setNotes,
	  getLatestNotes
	}), Underline, CustomHighlight, Highlight, HorizontalRule, CharacterCount.configure({limit})],
	content: {content},
	onCreate({editor}) {

	  editor.commands.setContent(content);

	},
	editorProps: {
	  attributes: {
		class: styles.editor,
	  },
	},
	onUpdate: ({editor}) => {
	  console.log(editor.getJSON());
	  handleChange(editor.getHTML());
	  //useHoverOnMarks();
	  // You can only use custom hooks inside react function components or other custom hooks
	},
  });

  const percentage = editor ? Math.round((100 / limit) * editor.storage.characterCount.characters()) : 0;



  // <div className={`character-count ${editor.storage.characterCount.characters() === limit ? 'character-count--warning' : ''}`}>
  // this doesnt work since we pass a literal string, but instead we need to pass the css object innerds
  if (!editor) {
	return null;
  }
  return (
	<Paper elevation={10}>
	  <div className={styles.isil}>
		<div className={styles.container}>
		  <Head>
			<title>MindMap Editor</title>
			<link rel="preconnect" href="https://fonts.googleapis.com"/>
			<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
			<link
			  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"/>
		  </Head>
		  <Toolbar
			editor={editor}
			content={content}
			pageId={pageId}
			positionTextField={showTextFieldAtCursor}
			isTextFieldShown={showTextField}
			setIsTextFieldShown={setShowTextField}
			textFieldPlacement={textFieldPosition}
		  />
		  <Paper>
			<div className={styles.editorContentWrapper}>
			  <EditorContent editor={editor}/>
			</div>
		  </Paper>
		  <div
			className={`${styles.characterCount} ${editor.storage.characterCount.characters() === limit ? styles.characterCountWarning : ''}`}
		  >
			<svg height="20" width="20" viewBox="0 0 20 20">
			  <circle r="10" cx="10" cy="10" fill="#e9ecef"/>
			  <circle
				r="5"
				cx="10"
				cy="10"
				fill="transparent"
				stroke="currentColor"
				strokeWidth="10"
				strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
				transform="rotate(-90) translate(-20)"
			  />
			  <circle r="6" cx="10" cy="10" fill="white"/>
			</svg>
			{editor.storage.characterCount.characters()} / {limit} characters
			<br/>
			{editor.storage.characterCount.words()} words
			<br/>
			Page {pageIndex + 1}/{totalPageCount}
		  </div>
		</div>
		<Typography
		  variant="body2"
		  display="inline"
		  style={{fontFamily: 'Playfair Display, serif', color: '#999999'}}
		  sx={{marginLeft: '10px', marginTop: '-50px',}}
		>
		  {autosaveInProgress ? 'Saving...' : 'Saved'}
		  {autosaveInProgress ? <CircularProgress size={12}/> :
			<CheckCircleOutlineIcon fontSize={'1.5rem'} sx={{marginTop: '-3px',}}/>}
		</Typography>

		{showPreviousButton ?
		  (
			<IconButton
			  onClick={onPreviousButton}
			  sx={{
				backgroundColor: '#8d65ab',
				'&:hover': {
				  backgroundColor: '#4B0082',
				},
				marginLeft: '500px',
				marginTop: '-40px',
			  }}
			>
			  <NavigateBeforeOutlinedIcon/>
			</IconButton>) : null}


		{showAddButton ? (
		  <IconButton
			onClick={onAddButtonClick}
			sx={{
			  backgroundColor: '#8d65ab',
			  '&:hover': {
				backgroundColor: '#592083',
			  },
			  marginLeft: '600px',
			  marginTop: '-40px',
			}}
		  >
			<AddCircleOutlineOutlinedIcon/>
		  </IconButton>
		) : (<IconButton
		  onClick={onNextButtonClick}
		  sx={{
			backgroundColor: '#8d65ab',
			'&:hover': {
			  backgroundColor: '#592083',
			},
			marginLeft: '600px',
			marginTop: '-40px',
		  }}
		>
		  <NavigateNextOutlinedIcon/>
		</IconButton>)}
	  </div>
	</Paper>
  );
};

export default Tiptap;
