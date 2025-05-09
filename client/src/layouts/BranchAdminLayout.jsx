import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiUsers, FiSettings, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/AppContext";

const BranchAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { handleLogout } = useAuth();
  const sidebarRef = useRef(null);

  // Handle outside click to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Lock scroll when sidebar is open
  // Lock scroll on open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarOpen]);

  return (
    <div className="flex md:h-[140vh]">
      {/* Sidebar Toggle Button */}
      <button
        className="absolute top-5 left-2 p-1 bg-blue-800 text-white rounded cursor-pointer hover:bg-blue-900 transition duration-300"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 text-white p-5 w-72 h-full fixed z-50 
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full "} `}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 text-white hover:bg-purple-800 rounded-full cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FiX size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center md:text-left mt-8 md:mt-0">
          Branch Admin
        </h1>

        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
          <NavLink
            to="/branchAdmin"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="create-students"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiUsers className="text-lg" />
            <span>Register Student</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-center w-full bg-purple-700 hover:bg-purple-800 rounded-xl p-2 mt-6 cursor-pointer"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default BranchAdminLayout;
