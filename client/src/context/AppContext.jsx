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
  const url =  "https://ttsdf-foundation-server.onrender.com"  //"https://app.theryit.com"   ;  //"http://localhost:3000";
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
      // console.log("Branches response comming from backend",response.data.branches)
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
      const allData = res.data.data.applyData || [];

      setNotificationCount(res.data.data.totalCount);

      if (user?.role === "branchAdmin") {
        const branchName = user.branchName;
        const filteredApplyData = allData.filter(
          (item) => item.center === branchName
        );

        setbranchCourseCount(filteredApplyData.length);

        setData({
          applyData: filteredApplyData,
          applyCourse: res.data.data.applyCourse || [],
          sendMsg: res.data.data.sendMsg || [],
        });
      } else {
        setbranchCourseCount(res.data.data.branchCourseCount);
        setData(res.data.data); // all 3: applyData, applyCourse, sendMsg
      }
    } catch (error) {
      console.log("Error fetching apply data", error);
    }
  }, [url, user]);

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
        applyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access auth context
export const useAuth = () => useContext(AppContext);
