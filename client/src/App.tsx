import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { SearchCourse } from "./components/SearchCourse.tsx";
import { Routes, Route } from "react-router-dom";
import Cart from "./components/Cart.tsx";
import { CartProvider } from "./components/CartContext.tsx";

function App() {
  return (
    <>
      <Navbar />
      <CartProvider>
        <Routes>
          <Route path="/search" element={<SearchCourse />}></Route>
          <Route path="/calender"></Route>
        </Routes>
        <Cart></Cart>
      </CartProvider>
    </>
  );
}
export default App;
