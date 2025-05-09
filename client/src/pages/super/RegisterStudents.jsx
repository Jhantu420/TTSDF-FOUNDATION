import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AppContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterStudents = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    fathername: "",
    mothername: "",
    address: "",
    dob: "",
    dor: "",
    gender: "",
    mobile: "",
    password: "",
    role: "student",
    branchName: "",
    branchCode: "",
    courseName: "",
    courseDuration: "",
    courseContent: "",
    highestQualification: "",
    images: [],
  });

  const { url, branches, courses } = useAuth();
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "branchName") {
      const selectedBranch = branches.find(
        (branch) => branch.branch_name === value
      );
      setStudentData({
        ...studentData,
        branchName: value,
        branchCode: selectedBranch ? selectedBranch.branch_code : "",
      });
    } else if (name === "courseName") {
      const selectedCourse = courses.find(
        (course) => course.course_name === value
      );
      setStudentData({
        ...studentData,
        courseName: value,
        courseDuration: selectedCourse ? selectedCourse.course_duration : "",
        courseContent: selectedCourse ? selectedCourse.course_content : "",
      });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    setStudentData({ ...studentData, images: e.target.files });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(studentData).forEach((key) => {
        if (key === "images") {
          Array.from(studentData.images).forEach((file) =>
            formData.append("images", file)
          );
        } else {
          formData.append(key, studentData[key]);
        }
      });

      const res = await axios.post(`${url}/api/v1/register-user`, formData, {
        withCredentials: true,
      });

      toast.success(res.data.message);
      toast.error(res.data.error);
      setRegisteredEmail(studentData.mobile); // Store email for OTP verification
      document.getElementById("imageUpload").value = null;

    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Error registering student."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <section className="bg-gray-100 flex items-center justify-center p-4">
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="w-full max-w-4xl bg-gray-800 shadow-md rounded-lg p-6 space-y-6">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Father's Name", name: "fathername", type: "text" },
            { label: "Mother's Name", name: "mothername", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "Date of Registration", name: "dor", type: "date" },
            { label: "Mobile Number", name: "mobile", type: "tel" },

            {
              label: "Highest Qualification",
              name: "highestQualification",
              type: "text",
            },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-md font-medium text-white">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={studentData[name]}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 font-bold"
                required
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={studentData.password}
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

          {/* Gender Selection */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-md font-medium text-white">
              Gender
            </label>
            <select
              name="gender"
              value={studentData.gender}
              onChange={handleChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-md text-gray-900 focus:ring-blue-500 focus:border-blue-500 font-bold"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {/* Branch Name */}
          <div>
            <label className="block text-md font-medium text-white">
              Branch Name
            </label>
            <select
              name="branchName"
              value={studentData.branchName}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring focus:ring-blue-300 text-md font-bold"
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
            <label className="block text-md font-medium text-white">
              Branch Code
            </label>
            <input
              name="branchCode"
              value={studentData.branchCode}
              readOnly // Make it read-only since it's auto-selected
              className="w-full p-2.5 border rounded-lg bg-gray-200 font-bold text-md"
            />
          </div>
          <div>
            <label className="block text-md font-medium text-white">
              Course Name
            </label>
            <select
              name="courseName"
              value={studentData.courseName}
              onChange={handleChange}
              className="w-full p-2.5 border rounded-lg focus:ring focus:ring-blue-300 text-md font-bold"
              required
            >
              <option value="">Select Course</option>
              {courses.map((courses) => (
                <option key={courses._id} value={courses.course_name}>
                  {courses.course_name}
                </option>
              ))}
            </select>
          </div>
          {/* Branch Code (Auto-filled) */}
          <div>
            <label className="block text-md font-medium text-white">
              Course Duration
            </label>
            <input
              name="courseDuration"
              value={studentData.courseDuration}
              readOnly // Make it read-only since it's auto-selected
              className="w-full p-2.5 border rounded-lg bg-gray-200 font-bold text-md"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-md font-medium text-white">
              Course Content
            </label>
            <textarea
              name="courseContent"
              value={studentData.courseContent}
              readOnly
              rows={4}
              className="w-full p-2.5 border rounded-lg bg-gray-200 font-bold text-md"
            />
          </div>

          {/* Upload Image */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-md font-medium text-white">
              Upload Profile Image
            </label>
            <input
              id="imageUpload"
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center ">
            <button
              type="submit"
              className="w-full py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition duration-300 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Student"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterStudents;
