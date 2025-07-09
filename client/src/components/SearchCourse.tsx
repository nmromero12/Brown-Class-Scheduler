import { useState, ChangeEvent } from "react";
import { useCart } from "../context/CartContext";
import { getAuth } from "firebase/auth";
import { Search, Plus, Clock, GraduationCap, Hash} from "lucide-react";
import { CartItem, Course } from "../types/course";

/**
 * SearchCourse component for searching and adding courses to the cart.
 * @returns JSX.Element
 */
export function SearchCourse() {
    const [searchCode, setSearchCode] = useState("");
    const [courses, setCourses] = useState<Course[] | null>(null);
    const [resultMessage, setResultMessage] = useState<string| null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const { addToCart, cartItems } = useCart();
    const [searchInput, setSearchInput] = useState("");
    const auth = getAuth();
    const user = auth.currentUser;
    


    /**
     * Handles input change for the course code search field.
     * Cleans and formats the input.
     * @param event - The input change event.
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const cleaned = event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase();
        setSearchCode(cleaned);
    };

    /**
     * Sets the search input state to the current search code.
     */
    const handleSearch = () => {
        setSearchInput(searchCode)
    }

    /**
     * Fetches courses from the backend based on the search code.
     * Handles loading, error, and result states.
     */
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
        const idToken = await user?.getIdToken()
        
        
        try {
            const response = await fetch(`http://localhost:8080/api/courses/code/${searchCode}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      })
            const data = await response.json();
            
            if (data.result === "success") {
                setCourses(data.courses);
                setError(false);
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

    /**
     * Adds a course item to the backend cart repository.
     * @param cartItem - The cart item to add.
     */
    async function addtoCartRepository(cartItem: CartItem) {
        try {

            const idToken = await user?.getIdToken()
            const response = await fetch('http://localhost:8080/cart/addToCart', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItem)

            });
            
            if (!response.ok) {
                throw new Error("Failed to add item");
            }
            
        } catch (error: any) {
        }
    }

    
    /**
     * Handles adding a course to the cart and repository.
     * Checks if the user is logged in.
     * @param course - The course to add.
     */
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

    /**
     * Clears the search results and resets related state.
     */
    const clearSearch = () => {
        setCourses(null);
        setResultMessage("");
        setError(false);
        setIsLoading(false)
        setSearchCode("");

    }


    return (
        <div className="space-y-6"
        >
            {/* Search Interface */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Find Courses</h2>
                
                {/* Search Form */}
                <div className="space-y-4">
                    <div>
                        {/* Course Code Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Course Code
                            </label>
                            <input
                                type="text"
                                value={searchCode}
                                onChange={handleInputChange}
                                placeholder="e.g., CSCI0320, ANTH0100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brown-500 focus:border-brown-500 transition-colors"
                            />
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
