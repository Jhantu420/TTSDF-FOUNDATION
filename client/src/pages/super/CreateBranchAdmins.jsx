import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateBranchAdmins = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    branchName: "",
    role: "branchAdmin",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const { url, branches } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0); // Track timer in seconds
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const startTimer = () => {
    setTimeLeft(5 * 60);
  };
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval); // Clear on unmount or state change
  }, [timeLeft]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}m ${seconds}s`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "branchName") {
      // Find the selected branch
      const selectedBranch = branches.find(
        (branch) => branch.branch_name === value
      );
      setFormData({
        ...formData,
        branchName: value,
        branchCode: selectedBranch ? selectedBranch.branch_code : "", // Auto-set branch code
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/v1/branchadmin`, formData, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setRegisteredEmail(formData.email);
      setOtpSent(true);
      startTimer(); // Start the countdown when OTP is sent
    } catch (error) {
      toast.error(error.response?.data?.message || "Error registering admin");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP.");
    try {
      const res = await axios.post(`${url}/api/v1/verifyOtp`, {
        email: registeredEmail,
        otp,
      });
      toast.success(res.data.message);
      setOtpSent(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        branchName: "",
        role: "branchAdmin",
      });
      setOtp("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post(`${url}/api/v1/resend-otp`, {
        email: registeredEmail,
      });

      if (response.data.success) {
        toast.success("New OTP sent successfully.");
        startTimer();
        setOtp("");
        setOtpSent(true); // Ensure OTP state is maintained
      } else {
        toast.error(response.data.message || "Error resending OTP.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <section className=" flex items-center justify-center m-5">
      <ToastContainer></ToastContainer>
      <div className="w-full  md:max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-white text-center">
          Register a Branch Admin
        </h1>

        {!otpSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2.5  rounded-lg bg-gray-200 text-gray-900  focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2.5  rounded-lg bg-gray-200 text-gray-900  focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                  required
                />
              </div>
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full p-2.5 rounded-lg bg-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                  placeholder="Enter 10-digit number"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-lg bg-gray-200 text-gray-900 focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                    required
                  />
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Branch Name
                </label>
                <select
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  className="w-full p-2.5  rounded-lg bg-gray-200 text-gray-900  focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch.branch_name}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Code (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-white">
                  Branch Code
                </label>
                <input
                  type="text"
                  name="branchCode"
                  value={formData.branchCode}
                  readOnly // Make it read-only since it's auto-selected
                  className="w-full p-2.5  rounded-lg bg-gray-200 text-gray-900  focus:ring-blue-500 focus:border-blue-500 font-bold text-md"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Admin"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-white text-center">OTP Verification</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2.5 border rounded-lg focus:ring focus:ring-green-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <span className="w-full text-center text-red-600 flex justify-center">
              {timeLeft > 0 ? formatTime() : "OTP Expired"}
            </span>
            <button
              onClick={handleVerifyOtp}
              className="w-full py-2.5 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition duration-300 cursor-pointer"
            >
              Verify OTP
            </button>
            {timeLeft <= 0 && (
              <button
                onClick={handleResendOtp}
                className="w-full py-2.5 text-white bg-green-600 hover:bg-green-700 rounded-lg font-medium focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition duration-300 cursor-pointer"
              >
                Resend OTP.
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateBranchAdmins;
