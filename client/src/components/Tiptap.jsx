"use client";

import {useEditor, EditorContent} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Highlight from '@tiptap/extension-highlight';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import CharacterCount from '@tiptap/extension-character-count';
import styles from "../styles/Tiptap.module.css";
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";

const limit = 280;
const Tiptap = ({onChange, content}) => {
    const [editable, setEditable] = useState(true);//set editability for upcoming stuff
    const handleChange = (newContent) => {
        console.log(newContent);
        onChange(newContent);
    };

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
                note_id: 100,
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
        extensions: [StarterKit, Underline, CustomHighlight, Highlight, HorizontalRule, CharacterCount.configure({limit})],
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
                    <Toolbar editor={editor} content={content}/>
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
                    </div>
                </div>
            </div>
        </Paper>
    );
};

export default Tiptap;
