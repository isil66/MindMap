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
        contextMenu.innerHTML = '<button id="remove-mark">Remove</button>';

        document.body.appendChild(contextMenu);

        document.getElementById('remove-mark')?.addEventListener('click', () => {
          const parent = target.parentNode;
          while (target.firstChild) {
            parent?.insertBefore(target.firstChild, target);
          }
          parent?.removeChild(target);
          contextMenu?.remove();
          contextMenu = null;
        });

        function handleClickOutside(event) {
          if (contextMenu && !contextMenu.contains(event.target)) {
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

                  console.log("hh",notes['1'].find((note: { id: number; }) => note.id === 2).content);
                  previousColor = target.style.backgroundColor;
                  target.style.backgroundColor = 'plum';

                  tippy(target, {
                    content: `content: ${notes}`,
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
