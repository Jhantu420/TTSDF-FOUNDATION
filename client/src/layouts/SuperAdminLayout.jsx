import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiUsers, FiSettings, FiFileText, FiMenu, FiX } from "react-icons/fi";
import { MdDashboard, MdOutlineWorkspacePremium } from "react-icons/md";

import { useAuth } from "../context/AppContext";
import { Outlet } from "react-router-dom"; // ✅ Add this at the top

const SuperAdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { handleLogout } = useAuth();
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
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

  // Lock scroll on open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isSidebarOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isSidebarOpen]);

  return (
    <div className="flex md:h-[140vh]">
      {/* Mobile toggle */}
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
        <button
          className="absolute top-4 right-4 p-2 text-white hover:bg-purple-800 rounded-full cursor-pointer"
          onClick={() => setIsSidebarOpen(false)}
        >
          <FiX size={24} />
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center md:text-left mt-8 md:mt-0">
          Super Admin
        </h1>

        <nav className="space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
          <NavLink
            to=""
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MdDashboard className="text-lg" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="super-create-branches"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiSettings className="text-lg" />
            <span>Create Branch</span>
          </NavLink>
          <NavLink
            to="super-create-branch-admin"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiUsers className="text-lg" />
            <span>Create Branch Admin</span>
          </NavLink>
          <NavLink
            to="create-students"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiUsers className="text-lg" />
            <span>Register Student</span>
          </NavLink>
          <NavLink
            to="super-create-courses"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiFileText className="text-lg" />
            <span>Create Course</span>
          </NavLink>
          <NavLink
            to="super-upload-recent-images"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiFileText className="text-lg" />
            <span>Upload Recent Image</span>
          </NavLink>
          <NavLink
            to="super-upload-recent-activity"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiFileText className="text-lg" />
            <span>Upload Recent Activity</span>
          </NavLink>
          <NavLink
            to="create-team"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiUsers className="text-lg" />
            <span>Create Team Member</span>
          </NavLink>

          <NavLink
            to="allcertificate"
            className="flex items-center space-x-2 p-2 hover:bg-purple-800 rounded-xl"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MdOutlineWorkspacePremium className="text-lg" />
            <span>ALL Certificate</span>
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

export default SuperAdminLayout;
