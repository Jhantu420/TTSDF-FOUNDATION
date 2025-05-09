import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AppContext";
const UploadActivity = () => {
  const { url } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.videoUrl) {
      toast.error("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${url}/api/v1/create-activity`, formData, {
        withCredentials: true,
      });
      toast.success("Activity uploaded successfully!");
      setFormData({ title: "", videoUrl: "" });
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4 ">
      <div className="w-full max-w-xl bg-gray-900 p-8 rounded-2xl shadow-lg">
        <ToastContainer position="top-right" autoClose={3000} />

        <h2 className="text-3xl font-extrabold text-center text-gray-100 mb-8">
          Super Upload - Recent Activity
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-100">
              Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-100">
              YouTube Video URL
            </label>
            <input
              type="text"
              name="videoUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.videoUrl}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            {loading ? "Uploading..." : "Upload Activity"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadActivity;


