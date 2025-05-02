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
                <a href="#" className="px-3 py-1 bg-gray-800 rounded text-white">Dashboard</a>
              </li>
              <li><a href="#" className="hover:text-white">Friends</a></li>
              <li><a href="#" className="hover:text-white">Cart</a></li>
              <li><a href="#" className="hover:text-white">Calendar</a></li>
            </ul>
          </div>
  
          {/* Right: Icons */}
          <div className="flex items-center space-x-4">
  
            {/* Profile Avatar (placeholder) */}
            <img
              src="https://i.pravatar.cc/40?img=1"
              alt="User"
              className="w-9 h-9 rounded-full border-2 border-white"
            />
          </div>
        </div>
      </nav>
    );
  }