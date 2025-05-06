import { useEffect, useState } from "react";
import Cart from "./Cart";

export default function Navbar() {
  const [isSignedIn, setSignedIn] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  useEffect(() => {
    const handleGoogleSignIn = () => setSignedIn(true);
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
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-4">
          <div className="mr-5">
            <Cart></Cart>
          </div>

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
        </div>
      </div>
    </nav>
  );
}
