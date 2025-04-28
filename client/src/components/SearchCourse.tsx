import { useState
 } from "react"

 import { ChangeEvent } from "react";

import { useEffect } from "react"


interface Course {
    id: number;
    courseCode: string;
    courseName: string;
    examTime: string;
    section: string;
    classTime: string;
    crn: string;
}

export function SearchCourse() {
    const [searchCode, setSearchCode] = useState(""); 
    const [courses, setCourses] = useState<Course[] | null>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCode(event.target.value);
        
    };


    

    



    

   
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