import React, { useState, useEffect } from "react";
import AffiliatedLogo from "../component/AffiliatedLogo";
import { useAuth } from "../context/AppContext";
import AboutUs from "../assets/about_us1.jpg";
import images from "../assets/collaborationImg.js";
const About = () => {
  const { url, branches } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Team Members
  const fetchData = async () => {
    try {
      const response = await fetch(`${url}/api/v1/get-team-member`, {
        credentials: "include", // If using cookies for authentication
      });
      const result = await response.json();

      if (response.ok) {
        setData(result.data || []); // Ensure setting only team member data
      } else {
        setError(result.message || "Failed to fetch team members");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 p-10">
        <div>
          <h2 className="text-3xl md:text-4xl text-center font-extrabold m-5 border-b-1">
            What we are
          </h2>
          <div className="bg-gray-100 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">
              Rastriya Youth Institute of Technology (RYIT)
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              RYIT is an <span className="font-semibold">ISO-certified</span>{" "}
              premier computer education center with esteemed academic
              collaborations, including
              <span className="font-semibold text-blue-600">
                {" "}
                The Neotia University, Admas University, JIS Group, Techno India
                University, Calcutta University of Technology, Seacom, OmDayal
                Group
              </span>
              , and more.
            </p>

            <h3 className="text-xl font-semibold text-blue-700 mt-4">
              Industry Collaboration
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              We proudly collaborate with top industries such as
              <span className="font-semibold text-blue-600">
                {" "}
                Ambuja Foundation, Skipper Limited, Flipkart, Amazon, Bajaj,
                Tata, Bhandari Automobile, Reliance, and Birla Cement
              </span>
              , ensuring students gain real-world exposure and career
              opportunities.
            </p>

            <h3 className="text-xl font-semibold text-blue-700 mt-4">
              Our Courses
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              We offer industry-relevant courses like
              <span className="font-semibold text-blue-600">
                {" "}
                CCA, DCA, ADOM, CDTP, DDTP, CFA, DIA
              </span>
              , and many more.
            </p>

            <h3 className="text-xl font-semibold text-blue-700 mt-4">
              Student Benefits
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed">
              <li>Free communication language classes</li>
              <li>Fire typing training</li>
              <li>Lifetime support with a practice card</li>
              <li>Expert educational guidance for career excellence</li>
            </ul>

            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              With a strong focus on quality learning and professional growth,
              <span className="font-semibold">RYIT empowers students</span> with
              the skills needed for a successful future in technology.
              <span className="text-blue-600 font-bold text-xl">🚀</span>
            </p>
          </div>
        </div>
        <img className="rounded-xl shadow-md" src={AboutUs} alt="Our mission" />
      </section>

      <div className="p-6 md:p-12 bg-gray-100">
        <h3 className="text-3xl md:text-4xl text-center font-extrabold mb-26 md:mb-30">
          Our Team
        </h3>

        {/* Handle Loading & Error States */}
        {loading ? (
          <p className="text-center text-gray-500">Loading team members...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-x-6 gap-y-24 px-4 sm:px-6">
            {data.map((member) => (
              <div
                key={member._id}
                className="relative bg-white p-6 md:p-8 rounded-4xl shadow-lg flex flex-col items-center transition duration-300 cursor-pointer hover:shadow-2xl w-full sm:w-72 mx-auto min-h-[300px]"
              >
                {/* Profile Image - Positioned Half Outside the Card */}
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-38 h-38 rounded-full border-4 border-white shadow-lg"
                  />
                </div>

                {/* Content Section */}
                <div className="mt-14 text-center">
                  <h4 className="text-2xl md:text-[22px] font-bold">
                    {member.name}
                  </h4>
                  <p className="text-sm md:text-[16px] text-green-400 font-medium">
                    {member.designation}
                  </p>
                  <p className="text-justify text-[14px] md:text-[15px] m-2 leading-snug">
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic and Industry Collaboration Section */}
      <div className="grid">
        <h3 className="grid text-4xl text-center font-extrabold text-gray-800 mb-10 leading-tight">
          Academic and Industry Collaboration
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 px-4 sm:px-6 text-center">
          {images.map((img, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex justify-center items-center mb-2">
                <img
                  src={img.src}
                  alt={img.name}
                  className="w-30 h-21 md:w-40 md:h-31 "
                />
              </div>

              <b className="text-blue-600 text-[14px] md:text-[18px]">
                {img.name}
              </b>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10">
        <AffiliatedLogo />
      </div>
    </>
  );
};

export default About;
