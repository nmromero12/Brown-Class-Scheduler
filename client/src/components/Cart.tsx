import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Calendar, Clock, GraduationCap, X } from "lucide-react";
import { CartItem, parsedCartItem } from "./SearchCourse";

export default function Cart() {
  const { cartItems, removeFromCart, initializeCart } = useCart();
  const [parsedItems, setParsedItems] = useState<parsedCartItem[] | []>([]);
  const [icsData, seticsData] = useState<string | null>(null);

  const auth = getAuth();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        populateCartForUser(currentUser.uid);
      } else {
        initializeCart([]);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (cartItems.length == 0) {
      setParsedItems([]);
      seticsData(null);
      return;
    }
    parseCart(cartItems);
    
    
  }, [cartItems])

  async function parseCart(cart: CartItem[]) {
  try {
    const parsedResponse = await fetch("http://localhost:8080/api/calendar/parse-cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart),
    });

    const parsedData = await parsedResponse.json();
    setParsedItems(parsedData);

    const icsResponse = await fetch("http://localhost:8080/api/calendar/ics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedData), 
    });

    const ics = await icsResponse.text();
    seticsData(ics);

      
    


  } catch (error) {
    console.error("Error parsing cart:", error);
  }
}

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

  const handleExportCalendar = async () => {
    if (!icsData) {
      alert("Calendar data not ready");
      return;
      
    }
    const blob = new Blob([icsData], { type: "text/calendar"});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brown_schedule.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
    
    // TODO: Implement calendar export functionality
    console.log("Exporting calendar for courses:", cartItems);
    
  };

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
          onClick={handleExportCalendar}
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
