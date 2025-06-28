import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { SearchCourse } from "./components/SearchCourse.tsx";
import { CartProvider } from "./components/CartContext.tsx";

import NavBarCart from "./components/NavBarCart.tsx"
import Cart from "./components/Cart.tsx"
import "./index.css"

function App() {

  // return (
  //   <>
  //   <Navbar/>
  //   </>
  // )
   return (
      <div className="min-h-screen bg-gray-50">
        
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Course Scheduler
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Search and organize your Brown University courses with ease. Build your perfect schedule by searching for courses and adding them to your personalized calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Search Area */}
            <div className="lg:col-span-2">
              <SearchCourse />
            </div>

            {/* Schedule Sidebar */}
            <div className="lg:col-span-1">
              <Cart />
            </div>
          </div>
        </div>
      </div>

  );
}
export default App;
