import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import StudentCard from "./studentlist/StudentCard";
import StudentTable from "./studentlist/StudentTable";
import StudentModal from "./studentlist/StudentModal.jsx";
import SearchBar from "./studentlist/SearchBar";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { url } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(""); // State for selected branch
  const [branches, setBranches] = useState([]); // State for unique branches

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/get-all-users`, {
          withCredentials: true,
        });
        setStudents(response.data.data);
        setFilteredStudents(response.data.data);
        // Extract unique branches
        const uniqueBranches = [
          ...new Set(response.data.data.map((student) => student.branchName)),
        ];
        setBranches(uniqueBranches);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [url]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterStudents(query, selectedBranch);
  };

  const handleBranchChange = (e) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    filterStudents(searchQuery, branch);
  };

  const filterStudents = (query, branch) => {
    const filtered = students.filter((student) => {
      const matchesQuery = [
        student.name,
        student.userId,
        student.mobile,
        student.branchName,
      ].some((field) => field.toLowerCase().includes(query.toLowerCase()));
      const matchesBranch = branch ? student.branchName === branch : true; // If no branch is selected, include all
      return matchesQuery && matchesBranch;
    });
    setFilteredStudents(filtered);
  };

  const handleUpdate = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSave = async (updatedStudent) => {
    try {
      await axios.put(
        `${url}/api/v1/update-user/${updatedStudent._id}`,
        updatedStudent,
        {
          withCredentials: true,
        }
      );
      const response = await axios.get(`${url}/api/v1/get-all-users`, {
        withCredentials: true,
      });
      setStudents(response.data.data);
      setFilteredStudents(response.data.data);
      setIsModalOpen(false);
      toast.success("Student updated successfully!");
    } catch (error) {
      toast.error("Failed to update student!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;
    try {
      await axios.delete(`${url}/api/v1/delete-user/${id}`, {
        withCredentials: true,
      });
      setStudents(students.filter((student) => student._id !== id));
      setFilteredStudents(
        filteredStudents.filter((student) => student._id !== id)
      );
      toast.success("Student deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete student!");
    }
  };

  // Calculate counts based on filtered students
  const totalStudentsInSelectedBranch = filteredStudents.length;

  const totalDownloadedCertificates = filteredStudents.filter(
    (student) => student.certificateDownloaded
  ).length;

  const totalUndownloadedCertificates = filteredStudents.filter(
    (student) => !student.certificateDownloaded
  ).length;

  const totalActiveStudents = filteredStudents.filter(
    (student) =>
      student.activeStatus === true || student.activeStatus === "true"
  ).length;

  const totalInactiveStudents = filteredStudents.filter(
    (student) =>
      student.activeStatus === false || student.activeStatus === "false"
  ).length;

  return (
    <div className="flex flex-col items-center">
      <ToastContainer />
      <h2 className="text-2xl md:text-4xl font-semibold text-center m-4 text-gray-800">
        STUDENT LIST
      </h2>
      <div>
        <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
      </div>
      <div className="mb-4">
        <label htmlFor="branch-select" className="mr-2">
          Select Branch:
        </label>
        <select
          id="branch-select"
          value={selectedBranch}
          onChange={handleBranchChange}
          className=" p-2 border border-gray-300 rounded-md bg-gray-200"
        >
          <option value="">All Branches</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>
      {students.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8 p-4 rounded-xl shadow-md mb-3">
              <span className="md:text-2xl font-semibold">Total Students:</span>
              <span className="md:text-2xl font-bold">
                {totalStudentsInSelectedBranch}
              </span>
            </div>
            <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8 p-4 rounded-xl shadow-md mb-3">
              <span className="md:text-2xl font-semibold">
                Active Students:
              </span>
              <span className="md:text-2xl font-bold">
                {totalActiveStudents}
              </span>
            </div>
            <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8 p-4 rounded-xl shadow-md mb-3">
              <span className="md:text-2xl font-semibold">
                Inactive Students:
              </span>
              <span className="md:text-2xl font-bold">
                {totalInactiveStudents}
              </span>
            </div>
            <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8 p-4 rounded-xl shadow-md mb-3">
              <span className="md:text-2xl font-semibold">
                Downloaded Certificates:
              </span>
              <span className="md:text-2xl font-bold">
                {totalDownloadedCertificates}
              </span>
            </div>
            <div className="flex gap-2 bg-purple-800 text-white md:px-10 md:py-8 p-4 rounded-xl shadow-md mb-3">
              <span className="md:text-2xl font-semibold">
                Undownloaded Certificates:
              </span>
              <span className="md:text-2xl font-bold">
                {totalUndownloadedCertificates}
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-red-600">No students found.....</p>
      )}
      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          {filteredStudents.length > 0 ? (
            <>
              <div className="max-h-250 overflow-y-auto w-full">
                <StudentTable
                  students={filteredStudents}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
              <div className="lg:hidden grid grid-cols-1 gap-4 max-h-350 overflow-y-auto w-full">
                {filteredStudents.map((student) => (
                  <StudentCard
                    key={student._id}
                    student={student}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <p className="text-red-600">No students found.....</p>
          )}
        </>
      )}
      {isModalOpen && selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentList;

// Branch admin ki vabe student der number ta deckhte pacche seta dekhte hobe
// already resgistered student der dawnload certificate field ta update korte hobe