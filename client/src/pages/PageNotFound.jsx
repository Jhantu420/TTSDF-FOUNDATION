import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <p className="text-2xl font-semibold">404 | Page Not Found</p>
      <Link
        to="/login"
        className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-900 text-white rounded-lg transition duration-300"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default PageNotFound;
