<<<<<<< HEAD
import { useState, ChangeEvent } from "react";
import { useCart } from "./CartContext";
import { getAuth } from "firebase/auth";
import { Search, Plus, Clock, GraduationCap, Hash } from "lucide-react";
=======
import { useState, useEffect, useContext } from "react"
import { ChangeEvent } from "react";
import { useCart } from "./CartContext";
>>>>>>> main

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

<<<<<<< HEAD
export type parsedCartItem = {
    startTime: string;
    endTime: string;
    days: string[];
    location: string;
    description: string;
    recurrence: string;

}

export function SearchCourse() {
    const [searchCode, setSearchCode] = useState("");
    const [department, setDepartment] = useState("");
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [resultMessage, setResultMessage] = useState<string| null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const { addToCart, cartItems } = useCart();
    const [searchInput, setSearchInput] = useState("");
    const auth = getAuth();
    const user = auth.currentUser;
=======
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
>>>>>>> main

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchCode(event.target.value);
    };

<<<<<<< HEAD
    const handleDepartmentChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setDepartment(event.target.value);
    };

    const handleSearch = () => {
        setSearchInput(searchCode)
    }

=======
>>>>>>> main
    async function fetchCourses() {
        if (!searchCode.trim()) {
            setResultMessage("Please enter a course code");
            setError(true)
            setCourses(null)
            return;
        }

        setIsLoading(true);
        setCourses(null);
        setResultMessage("");
        
        try {
            const response = await fetch(`http://localhost:8080/api/courses/code/${searchCode}`);
            const data = await response.json();
            
            if (data.result === "success") {
                setCourses(data.courses);
                setError(false);
                console.log(data.courses);
            } else {
                setCourses(null);
                setResultMessage(data.message);
            }
        } catch (error: any) {
            setResultMessage("Sorry connection to server failed");
        } finally {
            setIsLoading(false);
        }
    }

    async function addtoCartRepository(cartItem: CartItem) {
        try {
            const response = await fetch('http://localhost:8080/cart/addToCart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItem)
<<<<<<< HEAD
            });
            
            if (!response.ok) {
                throw new Error("Failed to add item");
            }
            console.log("Item added successfully");
        } catch (error: any) {
            console.log(error);
        }
    }

    const handleAddToCart = (course: Course) => {
        if (!user) {
            alert("You need to be logged in first");
            return;
        }

        const cartItem: CartItem = {
            userName: user.uid,
            courseCode: course.courseCode,
            courseName: course.courseName,
            examTime: course.examTime,
            section: course.section,
            classTime: course.classTime,
            crn: course.crn
        };

        

        addtoCartRepository(cartItem);
        addToCart(cartItem);
    };

    const clearSearch = () => {
        setCourses(null);
        setResultMessage("");
        setError(false);
        setIsLoading(false)
        setSearchCode("");

    }


    return (
        <div className="space-y-6">
            {/* Search Interface */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Find Courses</h2>
                
                {/* Search Form */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Code Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Code
                            </label>
                            <input
                                type="text"
                                value={searchCode}
                                onChange={handleInputChange}
                                placeholder="e.g., CSCI 0320, ANTH 0100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brown-500 focus:border-brown-500 transition-colors"
                            />
                        </div>
                        
                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Department (Optional)
                            </label>
                            <select 
                                value={department}
                                onChange={handleDepartmentChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brown-500 focus:border-brown-500 transition-colors"
                            >
                                <option value="">All Departments</option>
                                <option value="CSCI">Computer Science</option>
                                <option value="MATH">Mathematics</option>
                                <option value="ANTH">Anthropology</option>
                                <option value="ECON">Economics</option>
                                <option value="BIOL">Biology</option>
                                <option value="CHEM">Chemistry</option>
                                <option value="PHYS">Physics</option>
                                <option value="ENGL">English</option>
                                <option value="HIST">History</option>
                                <option value="POLS">Political Science</option>
                            </select>
                        </div>
                    </div>
                    
                    <button
                        onClick={ () => {
                            fetchCourses();
                            handleSearch();
                        }}
                        disabled={isLoading}
                        className="w-full bg-brown-600 hover:bg-brown-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Search className="w-5 h-5 mr-2" />
                        {isLoading ? "Searching..." : "Search Courses"}
                    </button>

                    <button
                        onClick={clearSearch}
                        className="w-full bg-brown-600 hover:bg-brown-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                        Clear Search
                    </button>
                </div>
=======
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
>>>>>>> main
            </div>

            {/* Error State */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center">
                        <div className="text-red-500 mr-3">⚠️</div>
                        <p className="text-red-800">{resultMessage}</p>
                    </div>
                </div>
            )}

            {/* Search Results */}
            {courses && (
                <div className="space-y-4">
                    {/* Results Header */}
                    <div className="flex items-center justify-between bg-brown-50 rounded-xl p-4 border border-brown-200">
                        <div>
                            <h3 className="text-lg font-semibold text-brown-900">
                                {courses.length} courses found for "{searchInput}"
                            </h3>
                            <p className="text-brown-700 text-sm">
                                Click "Add to Schedule" to build your course plan
                            </p>
                        </div>
                    </div>

                    {/* Course Cards */}
                    {courses.map((course) => (
                        <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {course.courseCode}
                                        </h4>
                                        <span className="bg-brown-100 text-brown-800 text-xs font-medium px-2 py-1 rounded-full">
                                            Section {course.section}
                                        </span>
                                    </div>
                                    <h5 className="text-gray-800 font-medium mb-3">
                                        {course.courseName}
                                    </h5>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <Clock className="w-4 h-4 text-brown-500 mr-2" />
                                            <span>
                                                <strong>Class Time:</strong> {course.classTime}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <GraduationCap className="w-4 h-4 text-brown-500 mr-2" />
                                            <span>
                                                <strong>Final Exam:</strong> {course.examTime || "No final exam"}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Hash className="w-4 h-4 text-brown-500 mr-2" />
                                            <span>
                                                <strong>CRN:</strong> {course.crn}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
<<<<<<< HEAD
                                <button
                                    onClick={() => handleAddToCart(course)}
                                    disabled={cartItems.some(item => item.crn === course.crn) || cartItems.length >= 6}
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
>
                                    <Plus className="w-4 h-4 mr-2" />
                                    {cartItems.some(item => item.crn === course.crn)
                                        ? "Added"
                                        : cartItems.length >= 6
                                        ? "Limit Reached"
                                        : "Add to Schedule"}
=======
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
>>>>>>> main
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results Message */}
            {resultMessage && !courses && (
                <div className="text-center py-12">
                    <div className="text-4xl text-gray-400 mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600">{resultMessage}</p>
                </div>
            )}

            {/* Empty State */}
            {!courses && resultMessage == "" && (
                <div className="text-center py-12">
                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Search for courses</h3>
                    <p className="text-gray-600">Enter a course code above to get started</p>
                </div>
            )}
        </div>
    );
}
