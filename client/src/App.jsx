import React from "react";
import { useLocation } from "react-router-dom";

import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Login from "./pages/Login";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import ApplyCourse from "./pages/ApplyCourse";
import PageNotFound from "./pages/PageNotFound";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import BranchAdminDashboard from "./pages/dashboard/BranchAdminDashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./context/AppContext";
import CreateBranch from "./pages//super/CreateBranch";
import RegisterStudent from "./pages/super/RegisterStudents";
import CreateCourses from "./pages/super/CreateCourses";
import CreateBranchAdmins from "./pages/super/CreateBranchAdmins";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import BranchAdminLayout from "./layouts/BranchAdminLayout";
import ResetPassword from "./pages/ResetPassword";
import ImageUploader from "./pages/super/ImageUploader";
import CreateTeam from "./pages/super/CreateTeam";
import UserMsg from "./pages/UserMsg";
import Branches from "./pages/Branches";
import StudentList from "./pages/StudentList";
import UploadActivity from "./pages/super/UploadActivity";
import VerifyUser from "./pages/verifyUser";
import AllComponent from "./pages/pdf/AllComponent";

const App = () => {
  const { user, loading } = useAuth();
  const location = useLocation(); // ✅ get current path

  if (loading) return <div>Loading...</div>; // Prevents flickering issues

  // ✅ List of routes where footer should be hidden
  const hideFooterRoutes = ["/super/allcertificate"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col ">
      <Navbar />
      <main className="">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/apply-course" element={<ApplyCourse />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/verify/:userId" element={<VerifyUser />} />

          <Route path="/branches" element={<Branches />} />
          <Route
            path="/users-msg"
            element={
              user?.role === "student" ? (
                <Navigate to="/" replace />
              ) : (
                <UserMsg />
              )
            }
          />

          {/* 🔒 Prevent logged-in users from accessing the login page */}
          <Route path="/login" element={<Login />} />

          {/* 🚀 Protected Routes with Role-Based Access */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["super"]} />}>
            <Route path="/super" element={<SuperAdminLayout />}>
              <Route index element={<StudentList />} />

              <Route path="super-create-branches" element={<CreateBranch />} />
              <Route path="create-students" element={<RegisterStudent />} />
              <Route path="super-create-courses" element={<CreateCourses />} />
              <Route
                path="super-create-branch-admin"
                element={<CreateBranchAdmins />}
              />
              <Route
                path="super-upload-recent-images"
                element={<ImageUploader />}
              />
              <Route
                path="super-upload-recent-activity"
                element={<UploadActivity />}
              />
              <Route path="create-team" element={<CreateTeam />} />
              <Route path="allcertificate" element={<AllComponent />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["branchAdmin"]} />}>
            <Route path="/branchAdmin" element={<BranchAdminLayout />}>
              <Route index element={<BranchAdminDashboard />} />
              <Route path="create-students" element={<RegisterStudent />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      {/* ✅ Conditionally render Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default App;
