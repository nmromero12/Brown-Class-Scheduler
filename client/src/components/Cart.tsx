import { useState, useEffect, useRef } from "react";
import { useCart } from "./CartContext";
import CalendarAddEvent from "./CalendarAddEvent";

export default function Cart() {
  const [showCart, setShowCart] = useState(false);
  const { cartItems, removeFromCart, initializeCart } = useCart();
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const cartRef = useRef<HTMLDivElement | null>(null);
  const cartIconRef = useRef<HTMLImageElement | null>(null);

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
    const handleGoogleSignIn = async () => {
      console.log("Cart: Handling Google Sign In");
      const storedToken = localStorage.getItem('googleAccessToken');
      const storedProfile = localStorage.getItem('googleUserProfile');
      if (storedToken && storedProfile) {
        const profile = JSON.parse(storedProfile);
        console.log("Cart: Setting user ID:", profile.id);
        setUserId(profile.id);
        setAccessToken(storedToken);
        // Wait for state to update before populating cart
        setTimeout(async () => {
          await populateCart();
        }, 0);
      }
    };

    const handleGoogleSignOut = () => {
      console.log("Cart: Handling Google Sign Out");
      setUserId(null);
      setAccessToken(null);
      initializeCart([]); // Clear cart on sign out
    };

    // Check for existing session
    const storedToken = localStorage.getItem('googleAccessToken');
    const storedProfile = localStorage.getItem('googleUserProfile');
    if (storedToken && storedProfile) {
      const profile = JSON.parse(storedProfile);
      console.log("Cart: Found existing session, user ID:", profile.id);
      setUserId(profile.id);
      setAccessToken(storedToken);
      // Wait for state to update before populating cart
      setTimeout(async () => {
        await populateCart();
      }, 0);
    }

    window.addEventListener('googleSignIn', handleGoogleSignIn);
    window.addEventListener('googleSignOut', handleGoogleSignOut);

    return () => {
      window.removeEventListener('googleSignIn', handleGoogleSignIn);
      window.removeEventListener('googleSignOut', handleGoogleSignOut);
    };
  }, [initializeCart]);

  // Add a separate effect to handle userId changes
  useEffect(() => {
    if (userId) {
      console.log("Cart: User ID changed, populating cart for:", userId);
      populateCart();
    }
  }, [userId]);

  async function populateCart() {
    if (!userId) {
      console.log("Cart: No user ID available for populating cart");
      return;
    }
    
    try {
      console.log("Cart: Fetching cart for user:", userId);
      const response = await fetch(
        `http://localhost:8080/cart/user/${userId}`
      );
      const data = await response.json();
      console.log("Cart: Received cart data:", data);
      if (data.result === "success") {
        console.log("Cart: Initializing cart with items:", data.items);
        initializeCart(data.items);
      }
    } catch (error: any) {
      console.error("Error populating cart:", error);
    }
  }

  async function deleteFromCartRepository(crn: string) {
    if (!userId) {
      console.error("Delete failed: No user ID available");
      return;
    }
    
    try {
      console.log("Attempting to delete item - CRN:", crn, "User ID:", userId);
      const response = await fetch(`http://localhost:8080/cart/deleteItem?crn=${crn}&username=${userId}`, {
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
      
      console.log("Successfully deleted item - CRN:", crn, "User ID:", userId);
    } catch (error: any) {
      console.error("Error deleting item:", {
        crn,
        userId,
        error: error.message,
        stack: error.stack
      });
    }
  }

  const handleAddEvent = async (course: any) => {
    if (!userId || !accessToken) {
      console.log("Please sign in");
      return;
    }

    try {
      const eventRequest: EventRequest = {
        summary: course.courseName,
        description: course.courseName,
        parseTime: course.classTime,
        recurrenceRule: "",
        startTime: "",
        endTime: "",
        userId: userId,
      };
      console.log(eventRequest);

      const response = await fetch(
        "http://localhost:8080/api/calendar/add-event",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventRequest),
        }
      );

      if (!response.ok) throw new Error("Failed to add event");

      console.log(response);
      // Dispatch event to refresh calendar
      window.dispatchEvent(new Event('calendarRefresh'));
    } catch (err) {
      console.error("Error adding event:", err);
    }
  };

  return (
    <div className="relative">
      <img
        ref={cartIconRef}
        src="src/components/assets/shopping-cart.png"
        alt="Cart Icon"
        onClick={toggleCart}
        className="cursor-pointer"
        style={{ width: "30px", height: "30px" }}
      />
      {showCart && (
        <div
          ref={cartRef}
          className="absolute right-2 mt-2 w-96 bg-white shadow-xl rounded-lg p-6 z-50"
          style={{
            top: cartIconRef.current ? cartIconRef.current.offsetTop + 40 : 0,
            right: "2px",
            maxHeight: "calc(100vh - 64px)",
            overflowY: "auto",
          }}
        >
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
                      onClick={async () => {
                        try {
                          console.log("Remove button clicked for CRN:", course.crn);
                          await deleteFromCartRepository(course.crn);
                          console.log("Database deletion successful, removing from local state");
                          await removeFromCart(course);
                          console.log("Local state updated successfully");
                        } catch (error) {
                          console.error("Failed to delete item:", {
                            crn: course.crn,
                            error: error instanceof Error ? error.message : 'Unknown error',
                            stack: error instanceof Error ? error.stack : undefined
                          });
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove
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
        </div>
      )}
    </div>
  );
}
