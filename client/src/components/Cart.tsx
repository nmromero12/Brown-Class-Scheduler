import { useState } from "react";
import { Course } from "./SearchCourse";
import { CartProvider } from "./CartContext";
import { useCart } from "./CartContext";

export default function Cart() {
  const [showCart, setShowCart] = useState(true);
  const {cartItems, removeFromCart} = useCart()

  const toggleCart = () => setShowCart((prev) => !prev);

  return (
    <div className="fixed top-20 right-6 z-50">
        
      <button
        onClick={toggleCart}
        className="mb-2 bg-gray-800 text-white text-sm px-3 py-1 rounded hover:bg-gray-700"
      >
        {showCart ? "Hide Cart" : "Show Cart"}
      </button>

      {showCart && (
        <div className="w-96 bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">Your Course Schedule</h2>


        {cartItems.length > 0 ? (
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.map((course) => (
                <li key={course.id} className="border-b pb-2">
                     <p className="text-sm font-medium text-gray-700">{course.courseCode} - {course.courseName}</p>
                     <p className="text-xs text-gray-500">Section: {course.section} | CRN: {course.crn}</p>
                     <p className="text-xs text-gray-500">Class: {course.classTime}</p>
                </li>
            ))}
            
          </ul>
        ) : (<p className="text-center text-gray-500">No items added to the cart</p>)}

          <div className="mt-4 border-t pt-3 flex justify-between items-center">
            
          </div>
        </div>
      )}
      
    </div>
  );
}
