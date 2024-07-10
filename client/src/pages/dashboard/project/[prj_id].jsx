import {useRouter} from 'next/router';
import {useEffect, useState} from "react";
import Tiptap from '../../../components/Tiptap'

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
const ProjectPage = () => {
    const [content, setContent] = useState('');
    const router = useRouter();
    const {prj_id} = router.query;//gets the url and finds the dynamic id//NEED CURLY BRACES TO DESTRUCT
    const handleContentChange = (reason) => {
        setContent(reason)
    }

    //An async function is really just syntax sugar for promises,
    // so when you call an async function, it's returning a promise.
    //But in useEffect u need to give it a function in this form () => {function();};
    //nstead, you can wrap your async function with an IIFE (Immediately-invoked Function Expression) like this,
    // so nothing is returned to useEffect and used as a cleanup function:
    //useEffect(() => {
    //   (async () => getResponse())();
    // });

    useEffect(() => {
        (async () => {
            try {
                const storedToken = localStorage.getItem('authToken');
                const response = await fetch(`${BASE_URL}/dashboard/${prj_id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${storedToken}`,
                    },
                });
                if (!response.ok) {
                    //const responseJson = await response.json();
                    //const errorMessage = responseJson.error;

                } else {
                    console.log("succes");
                    const responseJson = await response.json();
                    console.log(responseJson);
                    console.log("anaam", responseJson.pages[0].content)
                    setContent(responseJson.pages[0].content)
                }
            } catch (error) {
                console.log("err yedük yakala", error);
            }
        })();
    }, [prj_id]);

    if(!content)
    {return null;}

    return <Tiptap content={content}
                   onChange={(newContent) => handleContentChange(newContent)}/>
};
export default ProjectPage;