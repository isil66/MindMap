import React from 'react';
import Tooltip from '@mui/material/Tooltip';

const NoteTooltip = ({ children, noteId, open }) => {
  return (
	<Tooltip title={`Note ID: ${noteId}`} open={open}>
	  <span>{children}</span>
	</Tooltip>
  );
};

export default NoteTooltip;
