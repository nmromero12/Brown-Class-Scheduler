import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useUser, useAuth } from "@clerk/clerk-react";

export default function Cart() {
  const [showCart, setShowCart] = useState(true);
  const { cartItems, removeFromCart, initializeCart } = useCart();
  const { user } = useUser();
  const { getToken } = useAuth();

  type EventRequest = {
    summary: string;
    description: string;
    parseTime: string;
    recurrenceRule: string;
    startTime: string;
    endTime: string;
    userId: string;
  };
  const toggleCart = () => setShowCart((prev) => !prev);

  useEffect(() => {
    populateCart();
  }, [user]);

  async function populateCart() {
    if (user) {
      try {
        const response = await fetch(
          `http://localhost:8080/cart/user/${user.id}`
        );
        const data = await response.json();
        if (data.result === "success") {
          console.log("hello");
          initializeCart(data.items);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  }

  async function deleteFromCartRepository(crn: string) {
    try {
      await fetch(`http://localhost:8080/cart/deleteItem/${crn}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Item deleted successfully");
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleAddEvent = async (course: any) => {
    if (!user) {
      console.log("Please sign in");
      return;
    }

    try {
      const clerkToken = await getToken();

      const eventRequest: EventRequest = {
        summary: course.courseName,
        description: course.courseName,
        parseTime: course.classTime,
        recurrenceRule: "",
        startTime: "",
        endTime: "",
        userId: user.id,
      };

      const response = await fetch(
        "http://localhost:8080/api/calendar/add-event",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clerkToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventRequest),
        }
      );

      if (!response.ok) throw new Error("Failed to add event");

      console.log(response);
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <div className="relative z-50">
      <button
        onClick={toggleCart}
        className="bg-gray-800 text-white text-sm px-3 py-1 rounded hover:bg-gray-700"
      >
        {showCart ? "Hide Cart" : "Show Cart"}
      </button>
  
      {showCart && (
        <div className="mt-2 w-96 bg-white shadow-xl rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
            Your Course Schedule
          </h2>
  
          {cartItems.length > 0 ? (
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((course) => (
                <li key={course.crn} className="border-b pb-2">
                  <p className="text-sm font-medium text-gray-700">
                    {course.courseCode} - {course.courseName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Section: {course.section} | CRN: {course.crn}
                  </p>
                  <p className="text-xs text-gray-500">
                    Class: {course.classTime}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        deleteFromCartRepository(course.crn);
                        removeFromCart(course);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove from Cart
                    </button>
                    <button
                      onClick={() => {
                        handleAddEvent(course);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Add to GCAL
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No items added to the cart
            </p>
          )}
  
          <div className="mt-4 border-t pt-3"></div>
        </div>
      )}
    </div>
  );
  
}
