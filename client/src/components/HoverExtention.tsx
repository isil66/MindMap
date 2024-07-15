import {Extension} from '@tiptap/core'
import {Plugin, PluginKey} from 'prosemirror-state'
import Tooltip from '@mui/material/Tooltip';
import {useRef} from "react";
// @ts-ignore
import NoteTooltip from './NoteToolTip'
import ReactDOM from 'react-dom/client';
import React from 'react';

export const HoverExtension = Extension.create({
  name: 'hover',

  addProseMirrorPlugins() {
    let previousColor: string = '';

    return [
      new Plugin({
        key: new PluginKey('hover'),
        props: {
          handleDOMEvents: {
            mouseover(view, event) {
              const target = event.target as HTMLElement;
              if (target.tagName === 'MARK' && target.hasAttribute('note_id')
                  && target.getAttribute('note_id') != '0') {
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
                target.style.position = 'relative';
                target.style.cursor = 'pointer';
                //target.setAttribute('class', 'tooltip');
                // Show tooltip
                target.setAttribute('data-tooltip', `Note ID: ${noteId}`);
                return true;
              }
              return false;
            },
            mouseout(view, event) {
              const target = event.target as HTMLElement;
              if (target.tagName === 'MARK' && target.hasAttribute('note_id')
                  && target.getAttribute('note_id') != '0') {
                target.style.backgroundColor = previousColor;

                // Remove className attribute from mark element
                //target.removeAttribute('class');

                // Remove tooltip content from data attribute
                target.removeAttribute('data-tooltip');

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
});
export default HoverExtension;
