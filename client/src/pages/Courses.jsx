import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AppContext";
import Popup from "reactjs-popup";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const Courses = () => {
  const { courses, url, applyData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [render, setRender] = useState(false); // Force re-render for UI updates
  const currentImageIndexes = useRef({});
  const intervalsRef = useRef({});

  // Form state
  const [formData, setFormData] = useState({
    courseName: "",
    name: "",
    ph: "",
  });

  useEffect(() => {
    if (!courses || !Array.isArray(courses) || courses.length === 0) return;
    setLoading(false);

    courses.forEach((course) => {
      if (!currentImageIndexes.current[course._id]) {
        currentImageIndexes.current[course._id] = 0;
      }

      if (
        Array.isArray(course.image) &&
        course.image.length > 1 &&
        !intervalsRef.current[course._id]
      ) {
        intervalsRef.current[course._id] = setInterval(() => {
          currentImageIndexes.current[course._id] =
            (currentImageIndexes.current[course._id] + 1) % course.image.length;
          setRender((prev) => !prev);
        }, 2000);
      }
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
      intervalsRef.current = {};
    };
  }, [courses]);

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission
  const handleSubmit = async (e, courseName) => {
    e.preventDefault();

    if (!formData.name || !formData.ph) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/v1/apply-in-a-course`, {
        ...formData,
        courseName, // Ensure courseName is included
      });

      // console.log("Form submitted successfully:", response.data);
      toast.success(response.data.message);
      setFormData({ courseName: "", name: "", ph: "" }); // Reset form
      applyData();
      close();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading courses...</p>;
  }

  if (!courses || courses.length === 0) {
    return <p className="text-center text-gray-600">No courses available</p>;
  }

  return (
    <section className="bg-gray-100 py-16">
      <ToastContainer></ToastContainer>
      <div className="w-full mx-auto px-6 sm:px-8 ">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">
          📚 Our Courses
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3  gap-8">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-lg rounded-2xl p-6 flex flex-col"
            >
              {/* Course Image */}
              <div className="relative w-full h-56 overflow-hidden rounded-lg">
                {Array.isArray(course.image) && course.image.length > 0 ? (
                  <img
                    src={
                      course.image[currentImageIndexes.current[course._id] || 0]
                    }
                    alt={course.course_name}
                    className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                  />
                ) : (
                  <p className="text-gray-500">No image available</p>
                )}
              </div>

              {/* Course Information */}
              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                {course.course_full_name} ({course.course_name})
              </h3>
              <p className="text-gray-600 mt-2">
                ⏳ Duration: {course.course_duration}
              </p>

              {/* Course Content */}
              <h4 className="text-lg font-semibold text-gray-900 mt-4">
                📖 Course Content
              </h4>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {(() => {
                  try {
                    const content = Array.isArray(course.course_content)
                      ? course.course_content
                      : JSON.parse(course.course_content);
                    return content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ));
                  } catch (error) {
                    console.error(
                      "Invalid JSON in course_content:",
                      course.course_content
                    );
                    return <li>Invalid course content</li>;
                  }
                })()}
              </ul>

              {/* Extra Facilities */}
              <h4 className="text-lg font-semibold text-gray-900 mt-4">
                🎁 Extra Facilities
              </h4>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {(() => {
                  try {
                    const facilities = Array.isArray(course.extra_facilities)
                      ? course.extra_facilities
                      : JSON.parse(course.extra_facilities);
                    return facilities.map((facility, index) => (
                      <li key={index}>{facility.replace(/\[|\]/g, "")}</li>
                    ));
                  } catch (error) {
                    console.error(
                      "Invalid JSON in extra_facilities:",
                      course.extra_facilities
                    );
                    return <li>Invalid extra facilities</li>;
                  }
                })()}
              </ul>
              {/* Get Brochure Popup */}
              <Popup
                trigger={(open) => (
                  <div>
                    <button className="w-full flex justify-center align-center mt-5 py-2 text-white bg-purple-600 cursor-pointer rounded-full hover:bg-purple-700 transform duration-300">
                      Get Brochure
                    </button>
                  </div>
                )}
                modal
                nested
              >
                {(close) => (
                  <form
                    className="bg-gray-700 p-6 rounded-lg shadow-lg w-96"
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (!formData.name || !formData.ph) {
                        toast.error("Please enter your name and phone number.");
                        return;
                      }

                      try {
                        const response = await axios.post(
                          `${url}/api/v1/apply-in-a-course`,
                          {
                            ...formData,
                            courseName: "Brochure Request",
                          }
                        );

                        toast.success(response.data.message);

                        setTimeout(() => {
                          window.open(
                            "https://drive.google.com/file/d/160VIJaqIbmrHyc_ROoF1ceiRJFQyp-Ai/view?usp=sharing",
                            "_blank"
                          );
                          close();
                        }, 1000);
                      } catch (error) {
                        console.error(
                          "Error submitting brochure request:",
                          error
                        );
                        toast.error(
                          error.response?.data?.message ||
                            "Something went wrong"
                        );
                      }
                    }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Enter Your Details to Get the Brochure
                    </h2>
                    <div className="grid gap-5">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="p-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="ph"
                        placeholder="Enter Your Mobile No"
                        value={formData.ph}
                        onChange={handleInputChange}
                        required
                        className="p-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center align-center mt-3 py-2 text-white bg-purple-600 cursor-pointer rounded-full hover:bg-purple-700 transform duration-300"
                      >
                        Submit & Get Brochure
                      </button>
                    </div>
                  </form>
                )}
              </Popup>

              {/* Apply Now Button & Popup */}
              <Popup
                trigger={(open) => (
                  <div className="border flex justify-center m-10 bg-gray-800 rounded-full p-2 shadow-xl cursor-pointer hover:bg-gray-900 transition duration-400 hover:scale-110">
                    <button className="text-white cursor-pointer">
                      Apply Now
                    </button>
                  </div>
                )}
                modal
                nested
              >
                {(close) => (
                  <form
                    className="bg-gray-700 p-6 rounded-lg shadow-lg w-96"
                    onSubmit={(e) => handleSubmit(e, course.course_name)} // Pass courseName
                  >
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Applying For {course.course_full_name} (
                      {course.course_name})
                    </h2>
                    <div className="grid gap-5">
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Your Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="p-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="number"
                        name="ph" // Changed from "mobile" to "ph"
                        placeholder="Enter Your Mobile NO"
                        value={formData.ph}
                        onChange={handleInputChange}
                        required
                        className="p-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center align-center mt-3 py-2 text-white bg-purple-600 cursor-pointer rounded-full hover:bg-purple-700 transform duration-300"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                )}
              </Popup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
