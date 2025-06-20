import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { SearchCourse } from "./components/SearchCourse.tsx";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "./components/CartContext.tsx";
import Calendar from "./components/Calendar.tsx";

function App() {

  return (
    <>
    <Navbar/>
    </>
  )
  // return (
  //   <>
  //     <CartProvider>
  //       <Navbar/>
  //       <SearchCourse></SearchCourse>
  //       {/* <Calendar></Calendar> */}
  //       <Routes>
  //         <Route path="/calender"></Route>
  //       </Routes>
  //     </CartProvider>
  //   </>
  // );
}
export default App;
