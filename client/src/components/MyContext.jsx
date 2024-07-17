import React, {createContext, useContext, useState} from 'react';

export const NotesContext = createContext(
  [
	{id: 1, content: "Something 1"},
	{id: 2, content: "Something 2"}
  ]
);


// <NotesContext.Provider value={{ notes, setNotes }}>
//   {children}
// </NotesContext.Provider>


