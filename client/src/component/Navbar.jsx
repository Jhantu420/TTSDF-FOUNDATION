import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AppContext";
import Logo from "../assets/logo.png";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser, url, notificationCount, branchCourseCount } =
    useAuth();
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutsideSidebar = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutsideSidebar);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, [isSidebarOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/api/v1/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="border-gray-200 py-4 lg:py-6 bg-gray-900">
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className={`flex items-center ${
            user?.role === "super" || user?.role === "branchAdmin"
              ? "ml-10"
              : "mx-2"
          }`}
        >
          <img
            src={Logo}
            className="h-10 sm:h-12 mr-3 rounded-full"
            alt="TTSDF Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
            TTSDF
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center lg:order-1 space-x-8 mx-30">
          {[
            "Home",
            "About",
            "Contact",
            "Courses",
            "Branches",
            "Apply-Course",
          ].map((item, index) => (
            <div key={index}>
              <Link
                to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="relative text-gray-100 px-4 py-2 rounded-md transition-all duration-300 hover:text-white after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:after:left-0"
              >
                {item}
              </Link>
            </div>
          ))}
        </div>

        {/* Right Side Section */}
        <div className="flex items-center lg:order-2 gap-6 relative">
          {/* Notification Icon */}
          {(user?.role === "super" || user?.role === "branchAdmin") && (
            <Link
              to="/users-msg"
              className="relative inline-block cursor-pointer"
            >
              <FaBell size={26} color="white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full px-1.5 text-xs">
                {user?.role === "super" ? notificationCount : branchCourseCount}
              </span>
            </Link>
          )}

          {/* User Dropdown */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user.role === "student" ? (
                  <img
                    src={user?.image}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 dark:border-gray-600"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 text-gray-500 dark:text-gray-300 cursor-pointer" />
                )}
              </button>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-lg rounded-lg border border-gray-700 z-10"
                >
                  <div className="p-4 text-center border-b dark:border-gray-700">
                    {user.role === "student" ? (
                      <img
                        src={user?.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-full mx-auto border border-gray-300 dark:border-gray-600"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-500 dark:text-gray-300 mx-auto" />
                    )}
                    <p className="text-gray-200 font-medium mt-2">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {user.role.toUpperCase()}
                    </p>
                    <Link
                      onClick={() => setIsDropdownOpen(false)}
                      to={`/${user.role}`}
                      className="text-white bg-purple-700 py-1 px-4 rounded-xl hover:bg-purple-800"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <ul className="py-2">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-center cursor-pointer block w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link
                to="/login"
                className="text-white bg-purple-700 hover:bg-purple-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                Login
              </Link>
            </motion.div>
          )}
          
          {/* Sidebar Toggle Button - hidden for super and branchAdmin */}
          {!(user?.role === "super" || user?.role === "branchAdmin") && (
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 ml-3 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {isSidebarOpen && (
        <motion.div
          ref={sidebarRef}
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-50 lg:hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <img
              src={Logo}
              className="h-9 mr-3 sm:h-9 rounded-full"
              alt="TTSDF Logo"
            />
            <button
              onClick={toggleSidebar}
              className="text-white hover:bg-purple-900 rounded-2xl p-2"
            >
              ✖
            </button>
          </div>
          <ul className="p-4 space-y-4">
            {[
              "Home",
              "About",
              "Contact",
              "Courses",
              "Branches",
              "Apply-Course",
            ].map((item, index) => (
              <li key={index}>
                <Link
                  to={`/${item === "Home" ? "" : item.toLowerCase()}`}
                  onClick={() => setIsSidebarOpen(false)}
                  className="w-full text-white bg-purple-800 hover:bg-purple-900 rounded-md py-3 block text-center transition-all duration-200 "
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
