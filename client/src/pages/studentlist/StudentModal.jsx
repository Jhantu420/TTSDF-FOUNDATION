import React from "react";

const StudentModal = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = React.useState(student);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-5/10">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Update Student
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Add input fields for student data */}
          <div>
            <label className="block text-sm font-medium text-white">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Mobile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Father's Name
            </label>
            <input
              type="text"
              name="fathername"
              value={formData.fathername}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Father's Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Mother's Name
            </label>
            <input
              type="text"
              name="mothername"
              value={formData.mothername}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter Mother's Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rowhite"
              placeholder="Enter Address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={
                formData.dob
                  ? new Date(formData.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Date of Registration
            </label>
            <input
              type="date"
              name="dor"
              value={formData.dor}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Active Status
            </label>
            <select
              name="activeStatus"
              value={formData.activeStatus}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Theory Marks
            </label>
            <input
              type="number"
              name="theory"
              placeholder="Within 80"
              value={formData.theory || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Practical Marks
            </label>
            <input
              type="number"
              name="practical"
              placeholder="Within 20"
              value={formData.practical || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white">
              Typing Accuracy
            </label>
            <input
              type="number"
              name="typingMarks"
              value={formData.typingMarks || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Typing WPM
            </label>
            <input
              type="number"
              name="typingWPM"
              value={formData.typingWPM || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter New Password (optional)"
            />
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="p-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-600 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
