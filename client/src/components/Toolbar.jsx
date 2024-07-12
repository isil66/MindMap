"use client";

import React, {useRef} from "react";
import {Editor} from "@tiptap/react";
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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const Toolbar = ({editor, content}) => {
    const noteIdRef = useRef(0);// todo DB'den çek
    const takeNoteRef = useRef(true);

    if (!editor) {
        return null;
    }

    const handleClickTakeNoteStart = (e) => {
        e.preventDefault();
        takeNoteRef.current = false;

        const newNoteId = noteIdRef.current + 1;
        noteIdRef.current = newNoteId;

        editor.chain().focus().toggleHighlight({color: "#500bb6", note_id: newNoteId}).run(); // Add color options
    };

    const handleClickTakeNoteEnd = (e) => {
        e.preventDefault();
        takeNoteRef.current = true;

        editor.chain().focus().toggleHighlight({color: "#500bb6", note_id: noteIdRef.current}).run(); // Add color options
    };

    const handleClick = (e) => {
        if (takeNoteRef.current) {
            handleClickTakeNoteStart(e);
        } else {
            handleClickTakeNoteEnd(e);
        }
    };

    const buttonStyle = {
        margin: "5px",
        color: "#621d9a",
    };

    return (
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
                    onClick={handleClick}>
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
    );
};

export default Toolbar;
