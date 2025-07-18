import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar, Clock, GraduationCap, X } from "lucide-react";


const API_BASE = import.meta.env.VITE_API_BASE;
/**
 * Cart component for displaying and managing the user's course schedule.
 * Handles cart state, user authentication, and cart item management.
 * @returns JSX.Element
 */
export default function Cart() {
  const { cartItems, removeFromCart, initializeCart, exportCalendar } = useCart();
  const auth = getAuth();
  const [user, setUser] = useState<any>(null);

  /**
   * Effect to update cart and user state on authentication changes.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await populateCartForUser(currentUser);
      } else {
        initializeCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * Fetches and initializes the cart for the authenticated user with Firebase ID token.
   * @param currentUser - The authenticated Firebase user.
   */
  async function populateCartForUser(currentUser: any) {
    try {
      const idToken = await currentUser.getIdToken();
      const response = await fetch(`${API_BASE}/cart/user/${currentUser.uid}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.result === "success") {
        initializeCart(data.items);
      } else {
        throw new Error("cannot reach server")
      }
    } catch (error: any) {
      return
    }
  }

  /**
   * Deletes a course from the backend cart repository for the current user, including Firebase token.
   * @param crn - The course registration number to delete.
   */
  async function deleteFromCartRepository(crn: string) {
    if (!user) {
      return;
    }
    
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${API_BASE}/cart/deleteItem?crn=${crn}&username=${user.uid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
      
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      
    } catch (error: any) {
        throw new Error("Error deleting item");
      };
    }
  

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">My Schedule</h3>
        <span className="bg-brown-100 text-brown-800 text-sm font-medium px-3 py-1 rounded-full">
          {cartItems.length} courses
        </span>
      </div>

      {/* Schedule Items */}
      {cartItems.length > 0 ? ( 
        <div className="space-y-3 mb-6">
          {cartItems.map((course) => (
            <div key={course.crn} className="bg-gray-50 rounded-lg p-4 border-l-4 border-brown-500">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm">
                  {course.courseCode}
                </h4>
                <button
                  onClick={() => {
                    deleteFromCartRepository(course.crn);
                    removeFromCart(course);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-xs mb-2">
                {course.courseName}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-2" />
                  <span>{course.classTime}</span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-3 h-3 mr-2" />
                  <span>{course.examTime || "No final exam"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No courses added yet</p>
          <p className="text-gray-500 text-xs mt-1">
            Search and add courses to build your schedule
          </p>
        </div>
      )}

      {/* Export Button */}
      {cartItems.length > 0 && (
        <button
          onClick={exportCalendar}
          className="w-full bg-brown-600 hover:bg-brown-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Export to Calendar
        </button>
      )}

      {/* Schedule Summary */}
      {cartItems.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Schedule Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Courses:</span>
              <span className="font-medium">{cartItems.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Final Exams:</span>
              <span className="font-medium">
                {cartItems.filter(item => item.examTime && item.examTime !== "No final exam").length} scheduled
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
