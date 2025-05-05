import {
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import Cart from "./Cart";

export default function Navbar() {
  return (
    <nav className="bg-yellow-950 text-white px-4 py-3 shadow-md">
      <div className="max-w-full mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="src/components/assets/brownB.jpg"
              alt="Logo"
              style={{ width: 35 }}
            ></img>
            <span className="text-lg font-semibold">
              Brown Course Scheduler
            </span>
          </div>

          {/* Links */}
          <ul className="flex space-x-6 text-gray-300 font-medium">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                    isActive ? "bg-gray-700 text-white" : ""
                  }`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/search"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                    isActive ? "bg-gray-700 text-white" : ""
                  }`
                }
              >
                Search
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calender"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg hover:text-white hover:bg-gray-700 transition-colors duration-300 ${
                    isActive ? "bg-gray-700 text-white" : ""
                  }`
                }
              >
                Calendar
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <div className="mr-5">
            <Cart></Cart>
          </div>

          {/* User Button (conditionally rendered) */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
