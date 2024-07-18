import React, {createContext, useState, useRef, useEffect} from 'react';

export const NotesContext = createContext();

export const NotesContextProvider = ({children}) => {
  const [notes, setNotes] =
	useState([{id: 15, content: "ilk"}]);
  const notesRef = useRef(notes);

  useEffect(() => {
	notesRef.current = notes;
  }, [notes]);

  const getLatestNotes = () => notesRef.current;

  return (
	<NotesContext.Provider value={{notes, setNotes, getLatestNotes}}>
	  {children}
	</NotesContext.Provider>
  );
};