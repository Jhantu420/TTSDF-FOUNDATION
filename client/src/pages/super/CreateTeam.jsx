import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AppContext";
import "react-toastify/dist/ReactToastify.css";

const CreateTeam = () => {
  const { url } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    designation: "",
    image: null, // Store file instead of string
  });

  // Handle text input changes
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setData({ ...data, image: e.target.files[0] }); // Get the first selected file
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.description || !data.designation || !data.image) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("designation", data.designation);
    formData.append("image", data.image); // Append file

    try {
      const response = await axios.post(`${url}/api/v1/create-team`, formData, {
        withCredentials: true, // Sends cookies with request
        headers: {
          "Content-Type": "multipart/form-data", // Required for file upload
        },
      });

      toast.success("Team member created successfully!");
      setData({ name: "", description: "", designation: "", image: null });
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message || "Server error, please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-4xl bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          Create a Team Member
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-white m-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg text-md font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-white m-2">
              Description
            </label>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg text-md font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-white m-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={data.designation}
              onChange={handleChange}
              className="w-full p-2.5 rounded-lg text-md font-bold text-gray-900 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-white m-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Team Member"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateTeam;
