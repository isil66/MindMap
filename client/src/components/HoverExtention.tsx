import {Extension} from '@tiptap/core'
import {Plugin, PluginKey} from 'prosemirror-state'
import Tooltip from '@mui/material/Tooltip';

export const HoverExtension = Extension.create({
  name: 'hover',

  addProseMirrorPlugins() {

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
                target.style.backgroundColor = 'red';
                return true;
              }
              return false;
            },
            mouseout(view, event) {
              const target = event.target as HTMLElement;
              if (target.tagName === 'MARK' && target.hasAttribute('note_id')) {
                target.style.backgroundColor = '';
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
