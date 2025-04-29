import './App.css'
import Navbar from './components/Navbar.tsx'
import { SearchCourse } from './components/SearchCourse.tsx'
import {Routes, Route} from "react-router-dom"

function App() {

  return (
  <>
  <Navbar/>
    <Routes>
      <Route path="/search" element={<SearchCourse/>}></Route>
      <Route path="/calender"></Route>
    </Routes>
    

  </>
  )
}

export default App
