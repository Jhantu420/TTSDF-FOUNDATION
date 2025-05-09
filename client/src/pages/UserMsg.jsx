import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AppContext";
import { Trash2 } from "lucide-react";
import axios from "axios";

const UserMsg = () => {
  const {
    user,
    data,
    url,
    updateNotificationCount,
    updateBranchNotificationCount,
  } = useAuth();
  const [applyData, setApplyData] = useState([]);
  const [applyCourse, setApplyCourse] = useState([]);
  const [sendMsg, setSendMsg] = useState([]);

  useEffect(() => {
    if (data) {
      setApplyData(data.applyData || []);
      setApplyCourse(data.applyCourse || []);
      setSendMsg(data.sendMsg || []);
    }
  }, [data]);

  // Function to delete a message
  const handleDelete = async (id, type) => {
    try {
      const res = await axios.delete(`${url}/api/v1/delete-notification/${id}/${type}`);

      // Ensure state updates correctly
      if (type === "applyData") {
        setApplyData((prev) => prev.filter((item) => item._id !== id));
      } else if (type === "applyCourse") {
        setApplyCourse((prev) => prev.filter((item) => item._id !== id));
      } else {
        setSendMsg((prev) => prev.filter((item) => item._id !== id));
      }
      
      if (res.data.success) {
        const res = await axios.get(`${url}/api/v1/get-notification`);
        if (user?.role === "branchAdmin") {
          updateBranchNotificationCount(res.data.data.branchCourseCount);
        } else {
          updateNotificationCount(res.data.data.totalCount);
        }
      }
    } catch (error) {
      console.error("Error deleting message", error);
    }
  };

  return (
    <div className="p-6">
      {/* Branch Admin Table View */}
      {user?.role === "branchAdmin" ? (
        <div className="overflow-x-auto bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-3 text-center">Applied for a Course</h3>
          {applyData.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Name</th>
                  <th className="border border-gray-300 px-4 py-2">Mobile</th>
                  <th className="border border-gray-300 px-4 py-2">Center</th>
                  <th className="border border-gray-300 px-4 py-2">Course</th>
                  <th className="border border-gray-300 px-4 py-2">Applied At</th>
                  <th className="border border-gray-300 px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {applyData.map((item) => (
                  <tr key={item._id} className="bg-white text-center">
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.mobile}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.center}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.course}</td>
                    <td className="border border-gray-300 px-4 py-2">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button onClick={() => handleDelete(item._id, "applyData")} className="text-red-500 hover:text-red-700 cursor-pointer">
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No apply data available</p>
          )}
        </div>
      ) : (
        // Super Admin Grid Layout
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Apply Data Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-center">Applied for a Course</h3>
            {applyData.length > 0 ? (
              applyData.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Mobile:</strong> {item.mobile}</p>
                    <p><strong>Email:</strong> {item.email}</p>
                    <p><strong>Center:</strong> {item.center}</p>
                    <p><strong>Course Name:</strong> {item.course}</p>
                    <p><strong>Applied At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(item._id, "applyData")} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No apply data available</p>
            )}
          </div>

          {/* Apply Course Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-center">Applied in a Particular Course</h3>
            {applyCourse.length > 0 ? (
              applyCourse.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Mobile:</strong> {item.ph}</p>
                    <p><strong>Course Name:</strong> {item.courseName}</p>
                    <p><strong>Applied At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(item._id, "applyCourse")} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No apply course data available</p>
            )}
          </div>

          {/* Send Message Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-center">Received Messages</h3>
            {sendMsg.length > 0 ? (
              sendMsg.map((item) => (
                <div key={item._id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                  <div>
                    <p><strong>Name:</strong> {item.name}</p>
                    <p><strong>Mobile:</strong> {item.ph}</p>
                    <p><strong>Message:</strong> {item.msg}</p>
                    <p><strong>Applied At:</strong> {new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => handleDelete(item._id, "sendMsg")} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMsg;
