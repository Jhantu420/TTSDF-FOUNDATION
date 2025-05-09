import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
const CreateCourse = () => {
  const [courseData, setCourseData] = useState({
    course_name: "",
    course_full_name: "",
    course_content: "",
    course_duration: "",
    extra_facilities: "",
    images: [],
  });
  const { url } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setCourseData({ ...courseData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(courseData).forEach((key) => {
        if (key === "images") {
          Array.from(courseData.images).forEach((file) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, courseData[key]);
        }
      });

      const res = await axios.post(`${url}/api/v1/addCourse`, formData, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      setCourseData({
        course_name: "",
        course_full_name: "",
        course_content: "",
        course_duration: "",
        extra_facilities: "",
        images: [],
      });
      document.getElementById("imageUpload").value = null;
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100  flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          Create a New Course
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Course Name", name: "course_name", type: "text" },
            { label: "Full Course Name", name: "course_full_name", type: "text" },
            { label: "Course Content", name: "course_content", type: "text" },
            { label: "Course Duration", name: "course_duration", type: "text" },
            { label: "Extra Facilities", name: "extra_facilities", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-white m-2">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={courseData[name]}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 rounded-lg text-md font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          ))}

          <div className="col-span-1 md:col-span-2">
            <label className="block text-md font-medium text-white m-2">
              Upload Images
            </label>
            <input
              id="imageUpload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2.5 bg-gray-50  rounded-lg text-md text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateCourse;
