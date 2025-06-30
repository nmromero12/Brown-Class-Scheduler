import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { X, Calendar } from "lucide-react";

export default function NavBarCart() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeFromCart, initializeCart, exportCalendar } = useCart();
  const auth = getAuth();
  const user = auth.currentUser;

  const cartRef = useRef<HTMLDivElement | null>(null);
  const cartIconRef = useRef<HTMLImageElement | null>(null);

  const toggleCart = () => setShowCart((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        populateCartForUser(currentUser.uid);
      } else {
        initializeCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

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

  async function populateCartForUser(uid: string) {
    try {
      const response = await fetch(`http://localhost:8080/cart/user/${uid}`);
      const data = await response.json();
      if (data.result === "success") {
        initializeCart(data.items);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function deleteFromCartRepository(crn: string) {
    if (!user) {
      console.error("Delete failed: No user ID available");
      return;
    }
    
    try {
      console.log("Attempting to delete item - CRN:", crn, "User ID:", user.uid);
      const response = await fetch(`http://localhost:8080/cart/deleteItem?crn=${crn}&username=${user.uid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log("Successfully deleted item - CRN:", crn, "User ID:", user.uid);
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
        src="src/components/assets/shopping-cart.png"
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
