import React, {useState, useRef, useEffect} from 'react';
import Tooltip from '@mui/material/Tooltip';

const NoteTooltip = ({children, noteId}) => {
  const [open, setOpen] = useState(false);

  return (
	<Tooltip
	  title={`Note ID: ${noteId}`}
	  open={open}
	  onOpen={() => setOpen(true)}
	  onClose={() => setOpen(false)}
	>
	  <span>{children}</span>
	</Tooltip>
  );
};

export default NoteTooltip;
