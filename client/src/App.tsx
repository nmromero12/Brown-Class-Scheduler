import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { SearchCourse } from "./components/SearchCourse.tsx";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext.tsx";
import Calendar from "./components/Calendar.tsx";

function App() {
  return (
    <>
      <CartProvider>
        <Navbar />
        <div className="flex w-full">
          <div className="w-2/5">
            <SearchCourse></SearchCourse>
          </div>
          <div className="w-3/5">
            <Calendar></Calendar>
          </div>
        </div>
        <Routes>
          <Route path="/calender"></Route>
        </Routes>
      </CartProvider>
    </>
  );
}
export default App;
