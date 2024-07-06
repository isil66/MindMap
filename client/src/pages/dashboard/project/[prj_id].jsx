import {useRouter} from 'next/router';
import {useEffect} from "react";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
const ProjectPage = () => {
    const router = useRouter();
    const {prj_id} = router.query;//gets the url and finds the dynamic id//NEED CURLY BRACES TO DESTRUCT

    const fetchProjectDetails = async (prj_id) => {
        try {
            const storedToken = localStorage.getItem('authToken');
            const response = await fetch(`${BASE_URL}/dashboard/project/${prj_id}`, {
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
            }
        } catch (error) {
            console.log("err yedük yakala", error);
        }
    };
    useEffect( () => {

        fetchProjectDetails();
        return () => {
            console.log("cleanup function, which is optional");
        }
    }, [prj_id]);
    return <div>Hello {prj_id}</div>
};
export default ProjectPage;