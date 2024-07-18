import React, {createContext, useContext, useState} from 'react';

export const NotesContext = createContext();

export const NotesContextProvider = ({children}) => {
  const [notes, setNotes] =
	useState([{id: 15, content: "ilk"}]);

  return (
	<NotesContext.Provider value={{notes, setNotes}}>
	  {children}
	</NotesContext.Provider>
  );
};




