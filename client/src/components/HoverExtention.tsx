import {Extension} from '@tiptap/core';
import {Plugin, PluginKey} from 'prosemirror-state';
import tippy from 'tippy.js';
//import 'tippy.js/dist/tippy.css'; // Import Tippy.js CSS

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
              if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {
                const noteId = target.getAttribute('note_id');
                console.log('Hovered: ', noteId);

                // Initialize Tippy.js on the target element
                tippy(target, {
                  content: `Note ID: ${noteId}`,
                  appendTo: () => document.body,
                  delay: [0, 500],
                  onShow(instance) {
                    // Remove any existing tippy instance to avoid duplicates
                    const existingTippy = (target as any)._tippy;
                    if (existingTippy && existingTippy !== instance) {
                      existingTippy.destroy();
                    }
                  },
                });


                if ((target as any)._tippy) {
                  (target as any)._tippy.show();
                }

                return true;
              }
              return false;
            },
            mouseout(view, event) {
              const target = event.target as HTMLElement;
              if (target.tagName === 'MARK' && target.hasAttribute('note_id') && target.getAttribute('note_id') !== '0') {

                if ((target as any)._tippy) {
                  (target as any)._tippy.hide();
                }

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

export default HoverExtension;
