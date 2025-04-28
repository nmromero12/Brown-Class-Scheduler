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


    async function fetchCourses() {
        try {
            const response = await fetch(`http://localhost:8080/api/courses/code/${searchCode}`)
            if (!response.ok) throw new Error("Failed fetching data");
            const data = await response.json()
            if (data.result == "success") {
                setCourses(data.courses);
                console.log(data.courses);
            }
                
        } catch (error) {
            console.error("fetch error:", error);
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
      {courses && courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <strong>{course.courseCode}</strong>: {course.courseName} — Section {course.section}<br />
              Class Time: {course.classTime}, Exam Time: {course.examTime}, CRN: {course.crn}
            </li>
          ))}
        </ul>
      ) : courses === null ? (
        <p>Enter a course code and click submit.</p>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
            
        </div>
        


    )
}