import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

const StudentCard = ({ student, onUpdate, onDelete }) => {
  return (
    <div>
      <div className="border rounded-xl shadow-lg bg-white p-4 transition hover:shadow-xl">
        {student.image && (
          <img
            src={student.image}
            alt={student.name}
            className="w-28 h-28 object-cover rounded-full mx-auto border border-gray-300 shadow-sm"
          />
        )}
        <div className="text-center mt-3">
          <p className="text-lg font-semibold">{student.name}</p>
        </div>
        <div className="mt-3 space-y-1 text-sm text-gray-700">
          <p>
            <strong>ID:</strong> {student.userId}
          </p>
          <p>
            <strong>Mobile:</strong> {student.mobile}
          </p>
          <p>
            <strong>Father's Name:</strong> {student.fathername}
          </p>
          <p>
            <strong>Address:</strong> {student.address}
          </p>
          <p>
            <strong>Registered On:</strong> {student.dor}
          </p>
          <p>
            <strong>Branch:</strong> {student.branchName}
          </p>
          <p>
            <strong>Course:</strong> {student.courseName}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                student.activeStatus
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}
            >
              {student.activeStatus ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center gap-2 mt-4">
          <button
            onClick={() => onUpdate(student)}
            className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full transition"
          >
            <FiEdit size={18} />
            <span className="ml-2 text-sm">Edit</span>
          </button>
          <button
            onClick={() => onDelete(student._id)}
            className="flex items-center justify-center p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full transition"
          >
            <FiTrash size={18} />
            <span className="ml-2 text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
