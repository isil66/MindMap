import {useEditor, EditorContent} from "@tiptap/react";
import {useEffect, useState, useContext} from "react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CharacterCount from '@tiptap/extension-character-count';
import HoverExtension from './HoverExtention';
import {NotesContext} from "@/components/MyContext";
import styles from "../styles/Tiptap.module.css";
import Paper from '@mui/material/Paper';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import {IconButton, Typography, CircularProgress} from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Head from "next/head";

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
  const [editable, setEditable] = useState(true);
  const [autosaveInProgress, setAutosaveInProgress] = useState(false);
  const [showTextField, setShowTextField] = useState(false);
  const [textFieldPosition, setTextFieldPosition] = useState({top: 0, left: 0});
  const [noteContent, setNoteContent] = useState('');


  const showTextFieldAtCursor = (start = null, end = null, noteId = null) => {

	if (start === null || end === null) {
	  const from = editor.state.selection.from;
	  const to = editor.state.selection.to;
	  start = editor.view.coordsAtPos(from);
	  end = editor.view.coordsAtPos(to);
	}
	const latestNotes= getLatestNotes();
	console.log("noteid", noteId);
	const filler = latestNotes.find((note) => note.id === parseInt(noteId,10)).content;
	console.log("filler",filler);
	console.log("ediaağt",latestNotes);
	setNoteContent(filler);
	const top = (start.top + end.top) / 2 - 30;
	const left = (start.left + end.left) / 2;
	setTextFieldPosition({top, left});
	setShowTextField(true);

  };

  const handleChange = (newContent) => {
	console.log("content", content);
	onChange(newContent);
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
  }, [content]);

  const CustomHighlight = Highlight.extend({
	addCommands() {
	  return {
		setHighlight: attributes => ({commands}) => commands.setMark(this.name, attributes),
		toggleHighlight: attributes => ({commands}) => commands.toggleMark(this.name, attributes),
		unsetHighlight: () => ({commands}) => commands.unsetMark(this.name),
	  };
	},
	addStorage() {
	  return {note_id: 0};
	},
	onUpdate() {
	  this.storage.note_id += 1;
	},
	addOptions() {
	  return {multicolor: true, HTMLAttributes: {}};
	},
	addAttributes() {
	  return {
		note_id: {default: this.storage.note_id},
		color: {
		  default: null,
		  parseHTML: element => element.getAttribute('data-color') || element.style.backgroundColor,
		  renderHTML: attributes => {
			if (!attributes.color) return {};
			return {
			  'data-color': attributes.color,
			  style: `background-color: ${attributes.color}; color: inherit`,
			};
		  },
		},
	  };
	},
  });

  const editor = useEditor({
	editable,
	extensions: [
	  StarterKit,
	  HoverExtension({
		setNotes,
		getLatestNotes,
		showTextFieldAtCursor,
	  }),
	  Underline,
	  CustomHighlight,
	  Highlight,
	  HorizontalRule,
	  CharacterCount.configure({limit}),
	],
	content: {content},
	onCreate({editor}) {
	  editor.commands.setContent(content);
	},
	editorProps: {
	  attributes: {class: styles.editor},
	},
	onUpdate: ({editor}) => {
	  console.log(editor.getJSON());
	  handleChange(editor.getHTML());
	},
  });

  const percentage = editor ? Math.round((100 / limit) * editor.storage.characterCount.characters()) : 0;

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
			noteContent={noteContent}
			setNoteContent={setNoteContent}
		  />
		  <Paper>
			<div className={styles.editorContentWrapper}>
			  <EditorContent editor={editor}/>
			</div>
		  </Paper>
		  <div
			className={`${styles.characterCount} ${editor.storage.characterCount.characters() === limit ? styles.characterCountWarning : ''}`}>
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
		  sx={{marginLeft: '10px', marginTop: '-50px'}}
		>
		  {autosaveInProgress ? 'Saving...' : 'Saved'}
		  {autosaveInProgress ? <CircularProgress size={12}/> :
			<CheckCircleOutlineIcon fontSize={'1.5rem'} sx={{marginTop: '-3px'}}/>}
		</Typography>
		{showPreviousButton ? (
		  <IconButton
			onClick={onPreviousButton}
			sx={{
			  backgroundColor: '#8d65ab',
			  '&:hover': {backgroundColor: '#4B0082'},
			  marginLeft: '500px',
			  marginTop: '-40px',
			}}
		  >
			<NavigateBeforeOutlinedIcon/>
		  </IconButton>
		) : null}
		{showAddButton ? (
		  <IconButton
			onClick={onAddButtonClick}
			sx={{
			  backgroundColor: '#8d65ab',
			  '&:hover': {backgroundColor: '#592083'},
			  marginLeft: '600px',
			  marginTop: '-40px',
			}}
		  >
			<AddCircleOutlineOutlinedIcon/>
		  </IconButton>
		) : (
		  <IconButton
			onClick={onNextButtonClick}
			sx={{
			  backgroundColor: '#8d65ab',
			  '&:hover': {backgroundColor: '#592083'},
			  marginLeft: '600px',
			  marginTop: '-40px',
			}}
		  >
			<NavigateNextOutlinedIcon/>
		  </IconButton>
		)}
	  </div>
	</Paper>
  );
};

export default Tiptap;
