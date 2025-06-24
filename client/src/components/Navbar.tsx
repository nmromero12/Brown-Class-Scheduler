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
          {/* Sign Out Button */}
          <button
            onClick={SignOut}
            className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}