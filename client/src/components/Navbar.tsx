
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16z" />
            </svg>
            <span className="text-lg font-semibold">MyApp</span>

          </div>

          {/* Links */}
          <ul className="flex space-x-6 text-gray-300 font-medium">
            <li>
              <Link to="/" className="px-3 py-1 bg-gray-800 rounded text-white">Home</Link>
            </li>
            <li><Link to="/search" className="hover:text-white">Search</Link></li>
            <li><Link to="/calender" className="hover:text-white">Calender</Link></li>
          </ul>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          {/* Bell Icon */}
          <button className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 01-6 0h6z" />
            </svg>
          </button>

          {/* User Button (conditionally rendered) */}
          <SignedIn>
            <UserButton/>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
