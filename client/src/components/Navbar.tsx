<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import NavBarCart from "./NavBarCart";

export default function Navbar() {
  const SignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  };
=======
import { useEffect, useState } from "react";
import Cart from "./Cart";

export default function Navbar() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    // Check for existing session on mount
    const storedProfile = localStorage.getItem('googleUserProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setSignedIn(true);
      setProfilePicture(profile.picture);
    }

    const handleGoogleSignIn = () => {
      setSignedIn(true);
      const storedProfile = localStorage.getItem('googleUserProfile');
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setProfilePicture(profile.picture);
      }
    };

    const handleGoogleSignOut = () => {
      setSignedIn(false);
      setProfilePicture(null);
    };

    const handleProfileLoaded = (event: CustomEvent) => {
      setProfilePicture(event.detail.picture);
    };

    window.addEventListener('googleSignIn', handleGoogleSignIn);
    window.addEventListener('googleSignOut', handleGoogleSignOut);
    window.addEventListener('googleProfileLoaded', handleProfileLoaded as EventListener);
    
    return () => {
      window.removeEventListener('googleSignIn', handleGoogleSignIn);
      window.removeEventListener('googleSignOut', handleGoogleSignOut);
      window.removeEventListener('googleProfileLoaded', handleProfileLoaded as EventListener);
    };
  }, []);
>>>>>>> main

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
            />
            <span className="text-lg font-semibold">
              Brown Course Scheduler
            </span>
          </div>
          {/* Nav Links */}
          <div className="flex items-center space-x-4 ml-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "underline text-yellow-300"
                  : "hover:text-yellow-300"
              }
            >
              Search
            </NavLink>
            
            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                isActive
                  ? "underline text-yellow-300"
                  : "hover:text-yellow-300"
              }
            >
              Calendar
            </NavLink>
            <NavLink
              to="/friends"
              className={({ isActive }) =>
                isActive
                  ? "underline text-yellow-300"
                  : "hover:text-yellow-300"
              }
            >
              Friends
            </NavLink>
            
          </div>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <div className="mr-5">
            <NavBarCart />
          </div>
<<<<<<< HEAD
          {/* Sign Out Button */}
          <button
            onClick={SignOut}
            className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
=======

          {/* Google Calendar Connect Button */}
          {isSignedIn ? (
            <div className="relative">
              <img 
                src={profilePicture || ''} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      window.dispatchEvent(new Event('googleSignOut'));
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => window.dispatchEvent(new Event('googleSignIn'))}
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
            >
              Sign In
            </button>
          )}
>>>>>>> main
        </div>
      </div>
    </nav>
  );
}