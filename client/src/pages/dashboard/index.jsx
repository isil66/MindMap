import {useEffect, useState} from "react";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;

export default function Page() {
    const [revenue, setRevenue] = useState([]);

    useEffect(() => {
        fetch("${BASE_URL}/dashboard/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                return response.json();
            })
            .then((data) => {
                setRevenue(data);
            })
            .catch((error) => {
                console.error("Error fetching :", error);
            });
    }, []);

    return <div>hello</div>;
}
