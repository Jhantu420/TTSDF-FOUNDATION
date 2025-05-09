import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState(null);
  const [data, setData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // New state for notification count
  const [branchCourseCount, setbranchCourseCount] = useState(0); // New state for notification count
  const url = "http://localhost:3000";
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/v1/get-user-details`, {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch(`${url}/api/v1/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setUser(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Fetch branches
  const getBranches = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/v1/getBranches`);
      setBranches(response.data.branches);
    } catch (error) {
      console.log("Error fetching branches", error);
    }
  }, [url]);

  // Fetch courses
  const getCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/v1/getCourse`);
      setCourses(res.data.courses);
    } catch (error) {
      console.log("Error fetching courses", error);
    }
  }, [url]);

  // Fetch notification data
  const applyData = useCallback(async () => {
    try {
      const res = await axios.get(`${url}/api/v1/get-notification`);
      setData(res.data.data);
      setNotificationCount(res.data.data.totalCount); // Update notification count
      setbranchCourseCount(res.data.data.branchCourseCount); // Update notification count
    } catch (error) {
      console.log("Error fetching apply data", error);
    }
  }, [url]);

  useEffect(() => {
    getBranches();
    getCourses();
    applyData();
  }, [getBranches, getCourses, applyData]); // Dependencies are stable

  // Function to update notification count
  const updateNotificationCount = (newCount) => {
    setNotificationCount(newCount);
  };
  // Function to update notification count
  const updateBranchNotificationCount = (newCount) => {
    setbranchCourseCount(newCount);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        checkAuth,
        url,
        handleLogout,
        branches,
        courses,
        data,
        notificationCount, // Provide notification count
        branchCourseCount,
        updateNotificationCount, // Provide function to update notification count
        updateBranchNotificationCount,
        applyData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AppContext);
