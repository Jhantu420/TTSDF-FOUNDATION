import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AppContext"; // assuming url is stored here

const VerifyUser = () => {
  const { userId } = useParams();
  const { url } = useAuth(); // use your backend base URL from context
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("from params",userId)
        console.log("Encod uRi",encodeURIComponent(userId))
        const encodUri = encodeURIComponent(userId); // "RYIT/WB-B2534/002"
        const res = await axios.get(`${url}/api/v1/verify-user/${encodUri}`);
        if (res.data.success) {
          setUserData(res.data.data);
        } else {
          setError(res.data.message || "User not found");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Something went wrong");
      }
    };

    fetchUser();
  }, [userId, url]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  if (!userData) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {/* Profile Image */}
        {userData.image && (
          <div className="flex justify-center mb-4">
            <img
              src={userData.image}
              alt={userData.name}
              className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
            />
          </div>
        )}

        {/* Student Information */}
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          Welcome, {userData.name}
        </h1>
        <div className="border-t border-gray-300 mt-3 pt-3">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">Details</h2>
          <div className="grid md:grid-cols-3 gap-4 text-gray-600 text-sm">
            <p><strong>Name:</strong> {userData?.name}</p>
            <p><strong>User Id:</strong> {userData?.userId}</p>
            <p><strong>Course Name:</strong> {userData?.courseName}</p>
            <p><strong>Father's Name:</strong> {userData?.fathername}</p>
            <p><strong>Mother's Name:</strong> {userData?.mothername}</p>
            <p><strong>Address:</strong> {userData?.address}</p>
            <p><strong>Date of Birth:</strong> {userData?.dob}</p>
            <p><strong>Date of Registration:</strong> {userData?.dor}</p>
            <p><strong>Gender:</strong> {userData?.gender}</p>
            <p><strong>Mobile:</strong> {userData?.mobile}</p>
            <p><strong>Branch Name:</strong> {userData?.branchName}</p>
            <p><strong>Duration:</strong> {userData?.courseDuration}</p>
            <p><strong>Grade:</strong> {userData?.grade}</p>
            <p><strong>Theory Marks:</strong> {userData?.theory}</p>
            <p><strong>Practrical Marks:</strong> {userData?.practical}</p>
            <p><strong>Total Marks:</strong> {userData?.totalmarks}</p>
            <p><strong>Typing Accuricy:</strong> {userData?.typingMarks}</p>
            <p><strong>Typing WPM:</strong> {userData?.typingWPM}</p>
            <p><strong>Typing Grade:</strong> {userData?.typingGrade}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyUser;
