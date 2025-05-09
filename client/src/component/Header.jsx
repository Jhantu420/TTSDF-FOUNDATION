import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import HeaderStudent from "../assets/headerStudent.png";
import RecentHighLight from "./RecentHighLight";
import DirectorMsg from "./DirectorMsg";
import AffiliatedLogo from "./AffiliatedLogo";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AppContext";
const Header = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const {url} = useAuth()
  const handleClick = () => {
    navigate("/apply-course");
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await axios.get(
          `${url}/api/v1/get-activity`
        );
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    fetchActivities();
  }, []);

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 p-5 lg:p-10 m-5 lg:m-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <img
            src={HeaderStudent}
            alt="Header Student"
            className="rounded-md w-full"
          />
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Find Your Course <br /> & Strengthen Your Knowledge
          </p>
          <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
            "Your journey to mastering technology starts here. Empower yourself
            with the skills of tomorrow, today. <br /> Learn, grow, and innovate
            with expert guidance every step of the way."
          </p>
          <button
            onClick={handleClick}
            className="flex items-center justify-center gap-3 bg-gray-800 text-white px-6 py-3 rounded-2xl hover:bg-gray-900 transition-all shadow-xl text-lg mx-auto lg:mx-0 cursor-pointer"
          >
            Enroll Now
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
      <div className="p-6 md:p-12 bg-gray-100">
        <h3 className="text-3xl md:text-4xl text-center font-extrabold mb-26 md:mb-30">
          Our Recent Activity
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 px-4 sm:px-6">
          {activities.map((activity) => (
            <div key={activity._id} className="w-full max-w-4xl aspect-video">
              <iframe
                width="560"
                height="315"
                src={activity.videoUrl}
                title={activity.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full rounded-xl shadow-lg"
              ></iframe>
            </div>
          ))}
        </div>
      </div>
      {/* Additional Components */}
      <RecentHighLight />
      <DirectorMsg />
      <AffiliatedLogo />
    </>
  );
};

export default Header;
