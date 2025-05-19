import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AppContext";

const Branches = () => {
  const { branches } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const updated = { ...prev };
        branches.forEach((branch, idx) => {
          const images = branch.image || [];
          const current = prev[idx] || 0;
          updated[idx] = (current + 1) % (images.length || 1);
        });
        return updated;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [branches]);

  return (
    <div className="p-6 md:p-12">
      <h3 className="text-center text-4xl font-extrabold text-gray-800 mb-10 leading-tight">
        Our Institution
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-24 px-4 sm:px-6 text-center">
        {branches.map((branch, index) => {
          const images = branch.image || [];
          const imgSrc =
            Array.isArray(images) && images.length > 0
              ? images[currentImageIndex[index] || 0]
              : "https://via.placeholder.com/300";

          return (
            <div
              className="flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden"
              key={index}
            >
              <img
                src={imgSrc}
                alt={branch.branch_name}
                className="w-full h-88 object-cover transition-opacity duration-500 ease-in-out"
              />
              <div className="p-5">
                <h3 className="font-bold text-2xl text-gray-800 mb-2">
                  {branch.branch_name}
                </h3>
                <p className="text-gray-600">📍 {branch.branch_address}</p>
                <p className="text-gray-600">📞 {branch.mobile}</p>
                <p className="text-gray-600">✉️ {branch.email}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Branches;
