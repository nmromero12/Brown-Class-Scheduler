import './App.css'
import Navbar from './components/Navbar.tsx'
import { SearchCourse } from './components/SearchCourse.tsx'
import {Routes, Route} from "react-router-dom"
import Cart from './components/Cart.tsx'
import { CartProvider } from './components/CartContext.tsx' 
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton} from "@clerk/clerk-react";
function App() {

  return (
  <>
  <SignedOut><SignInButton/></SignedOut>
  <SignedIn>
  <Navbar/>
  <CartProvider>
    <Routes>
      <Route path="/search" element={<SearchCourse/>}></Route>
      <Route path="/calender"></Route>
    </Routes>
    <Cart/>
    </CartProvider>
    <SignOutButton/>
    </SignedIn>
    

  </>
  )
}

export default App
