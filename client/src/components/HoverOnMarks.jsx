import {useEffect} from 'react';

const useHoverOnMarks = () => {
    console.log("useHoverOnMarks");
    useEffect(() => {

        const handleHover = (event) => {
            const noteId = event.target.getAttribute('note_id');
            if (noteId) {
                console.log(`hover note_id: ${noteId}`);

            }
        };

        const markElements = document.querySelectorAll('mark[note_id]');


        markElements.forEach((el) => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleHover);
        });


        return () => {
            markElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleHover);
            });
        };
    }, []);
};

export default useHoverOnMarks;
