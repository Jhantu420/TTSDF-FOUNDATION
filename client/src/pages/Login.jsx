import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AppContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast,ToastContainer } from "react-toastify";

export default function Login() {
  const { url, setUser, checkAuth, user } = useAuth();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from?.pathname || `/${user.role}`;
      navigate(redirectTo, { replace: true });
    }
  }, [user]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleNormalLogin = async (e) => {
    e.preventDefault();
    const mobile = e.target.mobile.value.trim();
    const password = e.target.password.value.trim();
  
    if (!mobile || !password) {
      toast.error("Please enter both mobile number and password.", {
        position: "top-right",
      });
      return;
    }
  
    try {
      await axios.post(
        `${url}/api/v1/login`,
        { mobile, password },
        { withCredentials: true }
      );
      toast.success("Login successful!", {
        position: "top-right",
      });
      checkAuth();
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(message, {
        position: "top-right",
      });
      console.error("Login Failed:", message);
    }
  };
  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.", {
        position: "top-right",
      });
      return;
    }
  
    setLoading(true);
    try {
      await axios.post(`${url}/api/v1/forgetPassword`, { email });
      toast.success("Password reset email sent. Check your inbox.", {
        position: "top-right",
      });
      setIsForgotPasswordOpen(false);
      setEmail("");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email.";
      toast.error(message, {
        position: "top-right",
      });
      console.error("Forgot Password Failed:", message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4" onSubmit={handleNormalLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="number"
              name="mobile"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
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

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer"
          >
            Login
          </button>
        </form>

        <p
          className="text-center mt-3 text-sm text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsForgotPasswordOpen(true)}
        >
          Forgot Password?
        </p>

        <div className="my-4 text-center text-gray-500">or</div>

        {/* Fake Google Login UI Button */}
        <button
          type="button"
          disabled
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-colors cursor-not-allowed"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            <button
              className="w-full text-center mt-4 text-gray-500 hover:underline"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
