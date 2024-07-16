import React, {createContext, useContext, useState} from 'react';

export const NotesContext = createContext(
  {
	1: [{id: 1, content: 'Note 1 on page 1'}, {id: 2, content: 'Note 2 on page 1'}],
	2: [{id: 1, content: 'Note 1 on page 2'}, {id: 2, content: 'Note 2 on page 2'}],
  }
);


// <NotesContext.Provider value={{ notes, setNotes }}>
//   {children}
// </NotesContext.Provider>


