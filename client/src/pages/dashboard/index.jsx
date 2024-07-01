import { useEffect, useState } from "react";

export default function Page() {
  const [revenue, setRevenue] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }
        return response.json();
      })
      .then((data) => {
        setRevenue(data);
      })
      .catch((error) => {
        console.error("Error fetching revenue:", error);
      });
  }, []);

  return <div>hello</div>;
}
