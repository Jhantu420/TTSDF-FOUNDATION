import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const StudentTable = ({ students, onUpdate, onDelete }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 1500); // Hide after 1.5 sec
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="hidden lg:block p-4 rounded-lg shadow-md overflow-auto">
      <div className="max-h-[700px] overflow-y-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              {[
                "Image",
                "Name",
                "ID",
                "Mobile",
                "Father's Name",
                "Address",
                "Registered On",
                "Branch",
                "Course",
                "Status",
                "Actions",
                "C D",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="sticky top-0 z-10 border border-gray-300 p-2 bg-gray-200 text-black"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="border border-gray-300">
                <td className="border border-gray-300 p-2 text-center">
                  {student.image && (
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-12 h-12 object-cover rounded-full mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-[13px] font-bold">
                  {student.name}
                </td>
                <td
                  className="relative border border-gray-300 p-2 text-[13px] whitespace-nowrap font-bold cursor-pointer"
                  onClick={() => handleCopy(student.userId)}
                  title="Click to copy"
                >
                  {student.userId}
                  {copiedId === student.userId && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded shadow z-10 transition-opacity duration-300">
                      Copied!
                    </span>
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-[13px] font-bold">
                  {student.mobile}
                </td>
                <td className="border border-gray-300 p-2 text-[13px] font-bold">
                  {student.fathername}
                </td>
                <td className="border border-gray-300 p-2 text-[12px] font-bold max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {student.address}
                </td>
                <td className="border border-gray-300 p-2 text-[13px] font-bold">
                  {student.dor}
                </td>
                <td className="border border-gray-300 p-2 text-[12px] font-bold max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {student.branchName}
                </td>
                <td className="border border-gray-300 p-2 text-[13px] font-bold">
                  {student.courseName}
                </td>

                <td className="border border-gray-300 p-2 text-center font-bold">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      student.activeStatus
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {student.activeStatus ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onUpdate(student)}
                      className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(student._id)}
                      className="p-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                      title="Delete"
                    >
                      <FiTrash size={18} />
                    </button>
                  </div>
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] ${
                      student.certificateDownloaded
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {student.certificateDownloaded ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
