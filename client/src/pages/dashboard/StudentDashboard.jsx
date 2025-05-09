import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AppContext";

const StudentDashboard = () => {
  const { url, user } = useAuth();
  const [data, setData] = useState({});

  useEffect(() => {
    setData(user);
  }, [user]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        {/* Profile Image */}
        {data.image && (
          <div className="flex justify-center mb-4">
            <img
              src={data.image}
              alt={data.name}
              className="w-32 h-32 object-cover rounded-full border border-gray-300 shadow-sm"
            />
          </div>
        )}

        {/* Student Information */}
        <h1 className="text-center text-2xl font-semibold text-gray-800 mb-2">
          Welcome, {data.name}
        </h1>
        <div className="border-t border-gray-300 mt-3 pt-3">
          <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">Details</h2>
          <div className="grid md:grid-cols-3 gap-4 text-gray-600 text-sm">
            <p><strong>Name:</strong> {data?.name}</p>
            <p><strong>User Id:</strong> {data?.userId}</p>
            <p><strong>Email:</strong> {data?.email}</p>
            <p><strong>Course Name:</strong> {data?.courseName}</p>
            <p><strong>Father's Name:</strong> {data?.fathername}</p>
            <p><strong>Mother's Name:</strong> {data?.mothername}</p>
            <p><strong>Address:</strong> {data?.address}</p>
            <p><strong>Date of Birth:</strong> {data?.dob}</p>
            <p><strong>Date of Registration:</strong> {data?.dor}</p>
            <p><strong>Gender:</strong> {data?.gender}</p>
            <p><strong>Mobile:</strong> {data?.mobile}</p>
            <p><strong>Branch Name:</strong> {data?.branchName}</p>
            <p><strong>Duration:</strong> {data?.courseDuration}</p>
            <p><strong>Grade:</strong> {data?.grade}</p>
            <p><strong>Theory Marks:</strong> {data?.theory}</p>
            <p><strong>Practrical Marks:</strong> {data?.practical}</p>
            <p><strong>Total Marks:</strong> {data?.totalmarks}</p>
            <p><strong>Typing Accuricy:</strong> {data?.typingMarks}</p>
            <p><strong>Typing WPM:</strong> {data?.typingWPM}</p>
            <p><strong>Typing Grade:</strong> {data?.typingGrade}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
