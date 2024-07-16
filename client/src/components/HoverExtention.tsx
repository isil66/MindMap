import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {NotesContext} from './MyContext';

const HoverExtension = ({notes, setNotes}) => {
  return Extension.create({
    name: 'hover',

    addProseMirrorPlugins() {
      let previousColor: string = '';
      let contextMenu: HTMLElement | null = null;

      function createContextMenu(target: HTMLElement) {
        if (contextMenu) {
          contextMenu.remove();
        }

        contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.style.position = 'absolute';
        contextMenu.style.background = 'white';
        contextMenu.style.border = '1px solid #ccc';
        contextMenu.style.padding = '10px';
        contextMenu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.15)';
        contextMenu.style.display = 'flex';
        contextMenu.style.flexDirection = 'column';

        // Create the Remove button
        const removeButton = document.createElement('button');
        removeButton.id = 'remove-mark';
        removeButton.className = 'button-30';
        removeButton.setAttribute('role', 'button');
        removeButton.textContent = 'Remove';

        // Apply styles to Remove button (including original styles)
        removeButton.style.fontSize = '16px';  // Make the font size slightly smaller

        removeButton.addEventListener('focus', () => {
          removeButton.style.boxShadow = '#D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
        });

        removeButton.addEventListener('mouseover', () => {
          removeButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          removeButton.style.transform = 'translateY(-2px)';
        });

        removeButton.addEventListener('mouseout', () => {
          removeButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          removeButton.style.transform = 'none';
        });

        removeButton.addEventListener('mousedown', () => {
          removeButton.style.boxShadow = '#D6D6E7 0 3px 7px inset';
          removeButton.style.transform = 'translateY(2px)';
        });

        removeButton.addEventListener('mouseup', () => {
          removeButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          removeButton.style.transform = 'none';
        });

        // Create the Edit Note button
        const editButton = document.createElement('button');
        editButton.id = 'edit-content';
        editButton.textContent = 'Edit Note';

        // Apply styles to Edit Note button (same as Remove button)
        editButton.className = 'button-30';
        editButton.setAttribute('role', 'button');
        editButton.style.fontSize = '16px';  // Make the font size slightly smaller

        editButton.addEventListener('focus', () => {
          editButton.style.boxShadow = '#D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
        });

        editButton.addEventListener('mouseover', () => {
          editButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          editButton.style.transform = 'translateY(-2px)';
        });

        editButton.addEventListener('mouseout', () => {
          editButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          editButton.style.transform = 'none';
        });

        editButton.addEventListener('mousedown', () => {
          editButton.style.boxShadow = '#D6D6E7 0 3px 7px inset';
          editButton.style.transform = 'translateY(2px)';
        });

        editButton.addEventListener('mouseup', () => {
          editButton.style.boxShadow = 'rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset';
          editButton.style.transform = 'none';
        });

        contextMenu.appendChild(removeButton);
        contextMenu.appendChild(editButton);

        document.body.appendChild(contextMenu);

        removeButton.addEventListener('click', () => {
          const parent = target.parentNode;
          while (target.firstChild) {
            parent?.insertBefore(target.firstChild, target);
          }
          parent?.removeChild(target);
          contextMenu?.remove();
          contextMenu = null;
        });

        function handleClickOutside(event: MouseEvent) {
          if (contextMenu && !contextMenu.contains(event.target as Node)) {
            contextMenu.remove();
            contextMenu = null;
            document.removeEventListener('click', handleClickOutside);
          }
        }
        document.addEventListener('click', handleClickOutside);
      }


      return [
        new Plugin({
          key: new PluginKey('hover'),
          props: {
            handleDOMEvents: {
              mouseover(view, event) {
                const target = event.target as HTMLElement;


                if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                  const noteId = target.getAttribute('note_id');

                  console.log("hh", notes['1'].find((note: { id: number; }) => note.id === 2).content);
                  previousColor = target.style.backgroundColor;
                  target.style.backgroundColor = 'plum';

                  tippy(target, {
                    content: `content: ${noteId}`,
                    hideOnClick: false,
                    appendTo: () => document.body,
                    delay: [0, 500],
                    arrow: true,
                    onShow(instance) {
                      const existingTippy = (target as any)._tippy;
                      if (existingTippy && existingTippy !== instance) {
                        existingTippy.destroy();
                      }
                    },
                  });

                  if ((target as any)._tippy) {
                    (target as any)._tippy.show(1);
                  }

                  return true;
                }
                return false;
              },
              mouseout(view, event) {
                const target = event.target as HTMLElement;
                if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                  target.style.backgroundColor = previousColor;

                  if ((target as any)._tippy) {
                    (target as any)._tippy.destroy();
                  }

                  return true;
                }
                return false;
              },
              contextmenu(view, event) {
                const target = event.target as HTMLElement;
                if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                  event.preventDefault();
                  createContextMenu(target);
                  contextMenu!.style.top = `${event.pageY}px`;
                  contextMenu!.style.left = `${event.pageX}px`;
                  return true;
                }
                return false;
              }
            },
          },
        }),
      ];
    },
  });
};

export default HoverExtension;
