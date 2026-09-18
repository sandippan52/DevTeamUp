import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${
       isActive
         ? "bg-red-600 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`

  return (
    <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <div className="text-white font-semibold text-lg">
            DevTeamUp
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-2">
            <NavLink to="/home" className={linkClasses}>
              Home
            </NavLink>

            <NavLink to="/createteam" className={linkClasses}>
              Create Team
            </NavLink>

            <NavLink to="/joinrequest" className={linkClasses}>
              Join Request
            </NavLink>

            <NavLink to="/notification" className={linkClasses}>
              Notifications
            </NavLink>

            <NavLink to="/profile" className={linkClasses}>
              Your Profile
            </NavLink>

            <NavLink to="/logout" className={linkClasses}>
              Logout
            </NavLink>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>

        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="md:hidden flex flex-col space-y-2 pb-4">

            <NavLink
              to="/home"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/createteam"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Create Team
            </NavLink>

            <NavLink
              to="/joinrequest"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Join Request
            </NavLink>

            <NavLink
              to="/notification"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Notifications
            </NavLink>

            <NavLink
              to="/profile"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Your Profile
            </NavLink>

            <NavLink
              to="/logout"
              className={linkClasses}
              onClick={() => setMenuOpen(false)}
            >
              Logout
            </NavLink>

          </ul>
        )}

      </div>
    </nav>
  )
}

export default Navbar