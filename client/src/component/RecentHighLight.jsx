import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {useAuth} from '../context/AppContext'
const RecentHighLight = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flatImages, setFlatImages] = useState([]); 
  const {url} = useAuth()
  // Flattened image list

  // 📌 Fetch Images from API
  useEffect(() => {
    fetch(`${url}/api/v1/recent`)
      .then((res) => res.json())
      .then((data) => {
        // 🔹 Flatten the images array
        const allImages = data.flatMap((item) => item.images); // Extract all images into a single array
        setFlatImages(allImages);
      })
      .catch((error) => console.log(error));
  }, []);

  // 📌 Auto-Slide Effect (Changes Every 2 sec)
  useEffect(() => {
    if (flatImages.length === 0) return;
    // console.log(flatImages);
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flatImages.length);
    }, 5000); // Change every 2 sec

    return () => clearInterval(interval);
  }, [flatImages.length]);

  // 📌 Prevent Errors: Check if Images Exist
  if (flatImages.length === 0) {
    return <p className="text-center text-gray-500">Loading images...</p>;
  }

  return (
    <div className="relative m-10 p-2 md:p-10 max-h-full">
      <p className="text-4xl text-center font-extrabold text-gray-800 mb-6 leading-tight">
        Quick Views
      </p>

      {/* Display Flattened Image List */}
      <img
        src={flatImages[currentIndex]} // ✅ Now accessing from the flattened array
        alt={`Slide ${currentIndex + 1}`}
        className="w-full md:h-full lg:h-[600px] object-cover rounded-xl"
      />

      {/* Prev Button */}
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? flatImages.length - 1 : prevIndex - 1
          )
        }
        className="absolute md:top-1/2 top-40 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <ChevronLeft />
      </button>

      {/* Next Button */}
      <button
        onClick={() =>
          setCurrentIndex((prevIndex) => (prevIndex + 1) % flatImages.length)
        }
        className="absolute md:top-1/2 top-40 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default RecentHighLight;
