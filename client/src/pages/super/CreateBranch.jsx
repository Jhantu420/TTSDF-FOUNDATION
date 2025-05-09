import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
const CreateBranch = () => {
  const [branchData, setBranchData] = useState({
    branchId: "",
    branch_code: "",
    branch_name: "",
    branch_address: "",
    google_map_link: "",
    email: "",
    mobile: "",
    images: [],
  });
  const { url } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setBranchData({ ...branchData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setBranchData({ ...branchData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(branchData).forEach((key) => {
        if (key === "images") {
          Array.from(branchData.images).forEach((file) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, branchData[key]);
        }
      });

      const res = await axios.post(`${url}/api/v1/addBranch`, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message);

      setBranchData({
        branchId: "",
        branch_name: "",
        branch_code: "",
        branch_address: "",
        google_map_link: "",
        email: "",
        mobile: "",
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
    <section className="bg-gray-100 flex items-center justify-center p-4 ">
      <ToastContainer></ToastContainer>
      <div className="w-full max-w-3xl bg-gray-800 shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Create a New Branch
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Branch ID",
                name: "branchId",
                type: "text",
                placeholder: "TTSDF-RYIT-WB-001",
              },
              { label: "Branch Name", name: "branch_name", type: "text" },
              { label: "Branch Address", name: "branch_address", type: "text" },
              {
                label: "Google Map Link",
                name: "google_map_link",
                type: "text",
              },
              { label: "Email", name: "email", type: "email" },
              { label: "Mobile Number", name: "mobile", type: "text" },
              {
                label: "Branch Code",
                name: "branch_code",
                type: "text",
                placeholder: "B4628",
              },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-white">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={branchData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full p-2.5  rounded-lg bg-gray-200 text-gray-900  focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                  required
                />
              </div>
            ))}

            <div className="col-span-1 sm:col-span-2">
              <label className="block text-sm font-medium text-white">
                Upload Images
              </label>
              <input
                id="imageUpload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm text-gray-900 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Branch"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateBranch;
