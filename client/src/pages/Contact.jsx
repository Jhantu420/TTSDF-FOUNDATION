import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
const Contact = () => {
  const { branches, url, applyData } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [data, setData] = useState({
    name: "",
    ph: "",
    email: "",
    msg: "",
  });
  const handleMsgChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  // send us message submition
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/v1/send-msg`, data);
      if (res.data.success) {
        toast.success("Message Submited Successfully");
      }
      setData({
        name: "",
        email: "",
        ph: "",
        msg: "",
      });
      applyData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit");
    }
  };
  // Set default branch when branches are available
  useEffect(() => {
    if (branches?.length > 0) {
      setSelectedBranch(branches[0]);
    }
  }, [branches]);

  // Handle branch selection
  const handleBranchChange = (e) => {
    const branch = branches.find((b) => b._id === e.target.value);
    setSelectedBranch(branch);
    setCurrentImageIndex(0);
  };

  // Auto-change images in the branch image slider
  useEffect(() => {
    if (selectedBranch?.image?.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prev) => (prev + 1) % selectedBranch.image.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedBranch]);

  // Get Google Map embed link
  const mapEmbed = useMemo(() => {
    return { __html: selectedBranch?.google_map_link || "" };
  }, [selectedBranch?.google_map_link]);

  return (
    <section className="bg-gray-100">
      <ToastContainer></ToastContainer>
      <div className="max-w-7xl mx-auto py-16 px-6 sm:px-8 lg:py-20 lg:px-12">
        {/* Branch Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-900 mb-2">
            🏢 Select a Branch
          </label>
          {branches?.length > 0 ? (
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              onChange={handleBranchChange}
              value={selectedBranch?._id || ""}
            >
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-center text-gray-600">No branches available</p>
          )}
        </div>

        {/* Contact Info & Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-lg font-semibold">🏢 Branch Name</h3>
            <p className="mt-2">{selectedBranch?.branch_name || "N/A"}</p>

            <h3 className="text-lg font-semibold mt-4">📍 Address</h3>
            <p className="mt-2">{selectedBranch?.branch_address || "N/A"}</p>

            <h3 className="text-lg font-semibold mt-4">📞 Contact</h3>
            <p className="mt-2">✉️ Email: {selectedBranch?.email || "N/A"}</p>
            <p className="mt-2">📱 Phone: {selectedBranch?.mobile || "N/A"}</p>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-lg rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-center">
              ✉️ Send Us a Message
            </h3>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Your Name"
                name="name"
                value={data.name}
                onChange={handleMsgChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                name="ph"
                placeholder="Enter Your mobile number"
                value={data.ph}
                onChange={handleMsgChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={data.email}
                onChange={handleMsgChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Message"
                rows="4"
                name="msg"
                value={data.msg}
                onChange={handleMsgChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Google Map & Image Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {selectedBranch?.google_map_link && (
              <div
                dangerouslySetInnerHTML={mapEmbed}
                className="w-full h-96 md:h-[500px]"
              />
            )}
          </div>

          {/* Branch Image Carousel */}
          <div className="flex justify-center items-center relative w-full h-96 md:h-[500px]">
            {selectedBranch?.image?.length > 0 ? (
              <img
                src={selectedBranch.image[currentImageIndex]}
                alt="Branch"
                className="rounded-2xl shadow-lg w-full h-full object-cover"
              />
            ) : (
              <p className="text-gray-500">No image available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
