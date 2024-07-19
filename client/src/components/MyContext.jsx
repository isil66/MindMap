import React, {createContext, useState, useRef, useEffect} from 'react';

export const NotesContext = createContext();

export const NotesContextProvider = ({children}) => {
  const [notes, setNotes] =
	useState([{id: 1, content: "ilk"}]);
  const notesRef = useRef(notes);

  useEffect(() => {

	notesRef.current = notes;
	console.log("context", notesRef.current);
  }, [notes]);

  const getLatestNotes = () => {
	 return notesRef.current;
  };

  return (
	<NotesContext.Provider value={{notes, setNotes, getLatestNotes}}>
	  {children}
	</NotesContext.Provider>
  );
};