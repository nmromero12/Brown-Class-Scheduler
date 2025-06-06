import { useState, useEffect, useContext } from "react"
import { ChangeEvent } from "react";
import { useCart } from "./CartContext";

export type Course = {
    id: number;
    courseCode: string;
    courseName: string;
    examTime: string;
    section: string;
    classTime: string;
    crn: string;
}

export type CartItem = {
    userName: string;
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
    const [error, setError] = useState<String | null>(null);
    const {addToCart} = useCart()
    const [userProfile, setUserProfile] = useState<{ id: string, picture?: string } | null>(null);

    useEffect(() => {
        const storedProfile = localStorage.getItem('googleUserProfile');
        console.log('Stored profile:', storedProfile);
        if (storedProfile) {
            const profile = JSON.parse(storedProfile);
            console.log('Parsed profile:', profile);
            setUserProfile(profile);
        }

        const handleProfileLoaded = (event: CustomEvent) => {
            console.log('Profile loaded event:', event.detail);
            setUserProfile(event.detail);
        };

        window.addEventListener('googleProfileLoaded', handleProfileLoaded as EventListener);
        window.addEventListener('googleSignOut', () => setUserProfile(null));

        return () => {
            window.removeEventListener('googleProfileLoaded', handleProfileLoaded as EventListener);
            window.removeEventListener('googleSignOut', () => setUserProfile(null));
        };
    }, []);

    // Add a debug effect to monitor userProfile changes
    useEffect(() => {
        console.log('Current userProfile:', userProfile);
    }, [userProfile]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCode(event.target.value);
    };

    async function fetchCourses() {
        setIsLoading(true);
        setCourses(null);
        setError(null);
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
        } catch (error: any) {
            setError("Sorry, Connection to server failed");
        } finally {
            setIsLoading(false);
        }
    }

    async function addtoCartRepository(cartItem: CartItem) {
        try  {
            const response = await fetch('http://localhost:8080/cart/addToCart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItem)
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Failed to add item");
                }
                console.log("Item added successfully");
            })}
            catch(error: any) {
                console.log(error)
            }}

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
            <h1 className="text-2xl font-bold mb-4 text-center">Search Courses</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={searchCode}
                    onChange={handleInputChange}

                    placeholder="Enter Course Code (e.g. CSCI 0300, ANTH 0100)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6">
                <button
                    onClick={fetchCourses}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Submit"}
                    {error && <p className="text-red-500 text-center">{error}</p>}
                </button>
            </div>
            <div>
                {courses ? (
                    <>
                        <h2 className="text-xl font-semibold mb-4">Courses Found</h2>
                        <ul className="space-y-4">
                            {courses.map((course) => (
                                <li
                                key={course.id}
                                className="p-4 border border-gray-200 rounded-md shadow-sm bg-gray-50 flex flex-col"
                              >
                                <p><strong>Course Name:</strong> {course.courseName}</p>
                                <p><strong>Final Exam:</strong> {course.examTime ? course.examTime : "No final exam found"}</p>
                                <p><strong>Class Time:</strong> {course.classTime}</p>
                                <p><strong>Section:</strong> {course.section}</p>
                              
                                
                                <button className="mt-auto self-end bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow" onClick={async () => {
                                    if (!userProfile) {
                                        alert("You need to be signed in with Google first")
                                    } else {
                                    const cartItem: CartItem= {
                                        userName: userProfile.id || '',
                                        courseCode: course.courseCode,
                                        courseName: course.courseName,
                                        examTime: course.examTime,
                                        section: course.section,
                                        classTime: course.classTime,
                                        crn: course.crn
                                    };
                                    try {
                                        await addtoCartRepository(cartItem);
                                        await addToCart(cartItem);
                                    } catch (error) {
                                        console.error("Failed to add item:", error);
                                    }
                                }}}>
                                  Add To Cart
                                </button>
                              </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    resultMessage && <p className="text-red-500 text-center">{resultMessage}</p>
                )}
            </div>
        </div>
    );
}