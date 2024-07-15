import {Node} from '@tiptap/core';
import ReactDOM from 'react-dom/client';
import React, {useState, useEffect} from 'react';
import HoverExtension from "./HoverExtention";
// @ts-ignore
import NoteTooltip from './NoteTooltip'; // Ensure correct import

const HoverExtensionWithNodeView = Node.create({
  name: 'customNote',

  group: 'inline',

  inline: true,

  atom: true,

  addProseMirrorPlugins() {
	let previousColor = '';

	return [
	  new Plugin({
		key: 'hover',
		props: {
		  handleDOMEvents: {
			mouseover(view, event) {
			  const target = event.target;
			  if (target.tagName === 'MARK' && target.hasAttribute('note_id')
				&& target.getAttribute('note_id') !== '0') {
				const noteId = target.getAttribute('note_id');
				console.log('Hovered: ', noteId);
				previousColor = target.style.backgroundColor;
				target.style.backgroundColor = 'red';

				// const tooltipElement = document.createElement('div');
				// document.body.appendChild(tooltipElement);
				//
				// const root = ReactDOM.createRoot(tooltipElement);
				// root.render(
				//     <NoteTooltip noteId={noteId}>
				//       {target.cloneNode(true)}
				//     </NoteTooltip>
				// );

				//target.popover= "true";
				return true;
			  }
			  return false;
			},
			mouseout(view, event) {
			  const target = event.target;
			  if (target.tagName === 'MARK' && target.hasAttribute('note_id')
				&& target.getAttribute('note_id') !== '0') {
				target.style.backgroundColor = previousColor;

				// const tooltipElement = document.querySelector(`[data-note-id="${target.getAttribute('note_id')}"]`);
				// if (tooltipElement) {
				//   const root = ReactDOM.createRoot(tooltipElement);
				//   root.unmount();
				//   tooltipElement.remove();
				// }
				return true;
			  }
			  return false;
			},
		  },
		},
	  }),
	]
  },

  addAttributes() {
	return {
	  noteId: {
		default: null,
	  },
	};
  },

  parseHTML() {
	return [
	  {
		tag: 'mark[note_id]',
	  },
	];
  },

  renderHTML({HTMLAttributes}) {
	return ['mark', HTMLAttributes, 0];
  },

  addNodeView() {
	return ({node}) => {
	  const container = document.createElement('div');
	  const contentDOM = document.createElement('span');
	  container.appendChild(contentDOM);

	  const tooltipElement = document.createElement('div');
	  document.body.appendChild(tooltipElement);

	  let tooltipRoot;
	  let open = false;

	  const renderTooltip = (open) => {
		if (tooltipRoot) {
		  tooltipRoot.unmount();
		}

		tooltipRoot = ReactDOM.createRoot(tooltipElement);
		tooltipRoot.render(
		  <NoteTooltip noteId={node.attrs.noteId} open={open}>
			<span>{node.textContent}</span>
		  </NoteTooltip>
		);
	  };

	  container.addEventListener('mouseover', () => {
		open = true;
		renderTooltip(open);
	  });

	  container.addEventListener('mouseout', () => {
		open = false;
		renderTooltip(open);
	  });

	  return {
		dom: container,
		contentDOM,
		update: (updatedNode) => {
		  return true;
		},
		destroy: () => {
		  tooltipRoot.unmount();
		  tooltipElement.remove();
		},
	  };
	};
  },
});

export default HoverExtensionWithNodeView;