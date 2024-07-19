import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import {createPopper, Instance} from '@popperjs/core'; // positioning yapıyor sadece
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

const HoverExtension = ({setNotes, getLatestNotes, showTextFieldAtCursor}) => {
  return Extension.create({
    name: 'hover',

    addProseMirrorPlugins() {
      let previousColor = '';
      let contextMenu = null;
      let popperInstance = null;

      const deleteNote = async (noteID) => {
        try {
          const storedToken = localStorage.getItem('authToken');
          const response = await fetch(`${BASE_URL}/dashboard/page/notes/${noteID}/`, {
            method: 'DELETE',
            headers: {
              Authorization: `Token ${storedToken}`,
            },
          });

          if (!response.ok) {
            const responseJson = await response.json();
            const errorMessage = responseJson.error;
            console.log('error', errorMessage);
          } else {
            console.log('success in deleting note');
            let notes = getLatestNotes();
            setNotes(notes.filter((item) => item.id !== parseInt(noteID, 10)));
          }
        } catch (error) {
          console.error('Error deleting note:', error);
        }
      };

      function createContextMenu(target, view) {
        if (contextMenu) {
          contextMenu.remove();
          popperInstance?.destroy();
        }

        contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu p-2 bg-white border border-secondary shadow';
        contextMenu.style.display = 'flex';
        contextMenu.style.flexDirection = 'column';

        const removeButton = document.createElement('button');
        removeButton.id = 'remove-mark';
        removeButton.className = 'btn btn-danger my-1';
        removeButton.textContent = 'Remove';

        removeButton.addEventListener('click', () => {
          const parent = target.parentNode;
          while (target.firstChild) {
            parent?.insertBefore(target.firstChild, target);
          }
          parent?.removeChild(target);
          contextMenu?.remove();
          popperInstance?.destroy();
          contextMenu = null;
          deleteNote(target.getAttribute('note_id'));
        });

        const editButton = document.createElement('button');
        editButton.id = 'edit-content';
        editButton.className = 'btn btn-primary my-1';
        editButton.textContent = 'Edit Note';

        contextMenu.appendChild(editButton);
        contextMenu.appendChild(removeButton);

        editButton.addEventListener('click', () => {
          const cursorPosition = view.state.selection.from;
          console.log('Cursor position:', view.coordsAtPos(cursorPosition));
          showTextFieldAtCursor(view.coordsAtPos(cursorPosition), view.coordsAtPos(cursorPosition), target.getAttribute('note_id'));
        });
        document.body.appendChild(contextMenu);

        popperInstance = createPopper(target, contextMenu, {
          placement: 'bottom-start',
        });

        function handleClickOutside(event) {
          if (contextMenu && !contextMenu.contains(event.target)) {
            contextMenu.remove();
            popperInstance?.destroy();
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
                const notes = getLatestNotes();
                if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                  const noteId = target.getAttribute('note_id');
                  const currentNote = notes.find((item) => item.id === parseInt(noteId, 10));
                  previousColor = target.style.backgroundColor;

                  if (currentNote) {
                    target.style.backgroundColor = 'plum';

                    tippy(target, {
                      content: `${currentNote.content}`,
                      hideOnClick: false,
                      maxWidth: 200,
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
                  }

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
                  createContextMenu(target, view);
                  return true;
                }
                return false;
              },
            },
          },
        }),
      ];
    },
  });
};

export default HoverExtension;
