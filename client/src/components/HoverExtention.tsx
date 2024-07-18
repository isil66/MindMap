import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { createPopper, Instance } from '@popperjs/core';//positioning yapıyor sadece
import { NotesContext } from './MyContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const HoverExtension = ({ notes, setNotes }) => {
  return Extension.create({
    name: 'hover',

    addProseMirrorPlugins() {
      let previousColor: string = '';
      let contextMenu: HTMLElement | null = null;
      let popperInstance: Instance | null = null;

      function createContextMenu(target: HTMLElement) {
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
        });

        const editButton = document.createElement('button');
        editButton.id = 'edit-content';
        editButton.className = 'btn btn-primary my-1';
        editButton.textContent = 'Edit Note';

        contextMenu.appendChild(editButton);
        contextMenu.appendChild(removeButton);

        document.body.appendChild(contextMenu);

        popperInstance = createPopper(target, contextMenu, {
          placement: 'bottom-start',
        });

        function handleClickOutside(event: MouseEvent) {
          if (contextMenu && !contextMenu.contains(event.target as Node)) {
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

                if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                  const noteId = target.getAttribute('note_id');
                  console.log("notes all:", notes);
                  console.log("noteId: ",noteId);
                  console.log("hh", notes.find((item: { id: number; }) => item.id ===  parseInt(noteId,10))?.content);
                  previousColor = target.style.backgroundColor;
                  target.style.backgroundColor = 'plum';

                  tippy(target, {
                    content: `content: ${notes.find((item: { id: number; }) => item.id === 2).content}`,
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
