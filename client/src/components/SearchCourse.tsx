import { useState
 } from "react"

 import { ChangeEvent } from "react";

import { useEffect } from "react"

export function SearchCourse() {
    const [searchCode, setSearchCode] = useState(""); 

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCode(event.target.value);
        
    };


    async function fetchCourses() {
        fetch(`http://localhost:8080/api/courses/code/${searchCode}`).then((response) => {
            if (!response.ok) {
                console.log("Failed to fetch course code");
            }
            return response.json();
        }).then((data) => {
            
        })
    }

    



    

   
    return (
        <div>
            <input
            type="text"
            value={searchCode}
            onChange={handleInputChange}
            placeholder="Enter Course Code"></input>
            <button>Submit</button>
        </div>


    )
}