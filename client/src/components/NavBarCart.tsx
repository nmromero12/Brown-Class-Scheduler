import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { X, Calendar } from "lucide-react";
import cartIcon from "./assets/shopping-cart.png";

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * NavBarCart component displays the user's cart in a dropdown.
 * Handles cart state, user authentication, and cart item management.
 * @returns JSX.Element
 */
export default function NavBarCart() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeFromCart, initializeCart, exportCalendar } = useCart();
  const auth = getAuth();
  const user = auth.currentUser;

  const cartRef = useRef<HTMLDivElement | null>(null);
  const cartIconRef = useRef<HTMLImageElement | null>(null);

  /**
   * Toggles the visibility of the cart dropdown.
   */
  const toggleCart = () => setShowCart((prev) => !prev);

  /**
   * Effect to populate or clear the cart when authentication state changes.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        populateCartForUser(currentUser);
      } else {
        initializeCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * Effect to close the cart dropdown when clicking outside of it.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node) &&
        !cartIconRef.current?.contains(event.target as Node)
      ) {
        setShowCart(false);
      }
    };

    if (showCart) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCart]);

  /**
   * Fetches and initializes the cart for a given user ID.
   * @param uid - The user's unique ID.
   */
  async function populateCartForUser(currentUser: any) {
    try {
      const idToken = await currentUser.getIdToken()
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
      } 
    } catch (error: any) {
      
    }
  }

  /**
   * Deletes a course from the backend cart repository for the current user.
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
      console.error("Error deleting item:", {
        crn,
        user: user.uid,
        error: error.message,
        stack: error.stack
      });
    }
  }

  return (
    <div className="relative">
      {/* Cart Icon */}
      <img
        ref={cartIconRef}
        src={cartIcon}
        alt="Cart Icon"
        onClick={toggleCart}
        className="cursor-pointer hover:opacity-80 transition"
        style={{ width: "30px", height: "30px" }}
      />

      {/* Cart Dropdown */}
      {showCart && (
        <div
          ref={cartRef}
          className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-xl border border-gray-200 py-4 px-4 z-50"
        >
          <h3 className="text-gray-900 font-semibold text-lg mb-4 border-b border-gray-200 pb-2 text-center">
            Your Schedule
          </h3>

          {cartItems.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {cartItems.map((course) => (
                <div
                  key={course.crn}
                  className="bg-gray-50 rounded-lg p-3 border-l-4 border-yellow-800"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {course.courseCode}
                      </p>
                      <p className="text-gray-600 text-xs mb-1">
                        {course.courseName}
                      </p>
                      <p className="text-gray-500 text-xs">
                        Section {course.section} | CRN {course.crn}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {course.classTime}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await deleteFromCartRepository(course.crn);
                        removeFromCart(course);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No courses added yet</p>
              <p className="text-gray-500 text-xs mt-1">
                Search and add courses to build your schedule
              </p>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={exportCalendar}
                className="w-full bg-yellow-900 hover:bg-yellow-950 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Export to Calendar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
