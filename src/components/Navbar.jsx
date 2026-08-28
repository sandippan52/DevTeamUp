import React from 'react'
import { NavLink } from 'react-router-dom'
// import "./Navbar.css"

const Navbar = () => {
   const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${
       isActive
         ? "bg-red-600 text-white"
         : "text-gray-300 hover:bg-gray-700 hover:text-white"
     }`;
  return (
   <nav className="bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          
          
          <div className="text-white font-semibold text-lg">
            DevTeamUp
          </div>

          
          <ul className="flex space-x-2">
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
            {/* <NavLink to="/logout" className={linkClasses}>
              Logout
            </NavLink> */}
          </ul>

        </div>
      </div>
    </nav>
  )
}

export default Navbar