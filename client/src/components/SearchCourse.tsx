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
    const [resultMessage, setResultMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCode(event.target.value);
    };


    async function fetchCourses() {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/courses/code/${searchCode}`)
            const data = await response.json()
            if (data.result == "success") {
                setCourses(data.courses);
                console.log(data.courses);
            } else {
                setCourses(null);
                setResultMessage(data.message);
            }
                
        } catch (error) {
            console.error("fetch error:", error);
        } finally {
            setIsLoading(false);
        }

    }
   
    return (
        <div>
            <input
            type="text"
            value={searchCode}
            onChange={handleInputChange}
            placeholder="Enter Course Code"></input>
            <button onClick={fetchCourses}>Submit</button>

            <div>
                {courses ? (
                    <>
                        <h1>Courses Found</h1>
                        <ul>
                            {courses.map((course) => (
                                <li key={course.courseCode}>
                                    <p>Course Name: {course.courseName}</p>
                                    <p>Final Exam: {course.examTime}</p>
                                    <p>Class Time: {course.classTime}</p>
                                    <p>Section: {course.section}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                    
    
                    
                ) : (
                    <p>{resultMessage}</p>
                )}
            </div>
            
        </div>
        


    )
}