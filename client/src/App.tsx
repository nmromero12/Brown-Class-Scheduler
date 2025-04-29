import './App.css'
import Navbar from './components/Navbar.tsx'
import { SearchCourse } from './components/SearchCourse.tsx'
import {Routes, Route} from "react-router-dom"
import Cart from './components/Cart.tsx'
function App() {

  return (
  <>
  <Navbar/>
    <Routes>
      <Route path="/search" element={<SearchCourse/>}></Route>
      <Route path="/calender"></Route>
    </Routes>
    <Cart/>
    

  </>
  )
}

export default App
