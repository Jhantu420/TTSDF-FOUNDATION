import React, { useState, useEffect } from "react";
import DirectorPic from "../assets/DirectorPic.jpg";

const DirectorMsg = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [text6, setText6] = useState("");
  const [text7, setText7] = useState("");

  const messages = [
    "Welcome to TTSDF FOUNDATION",
    "Welcome to our computer center, where we empower individuals with essential computer skills and knowledge. In today’s fast-paced digital world, continuous learning is key, and that’s what we offer here.",
    "As the Director, my vision is to create an engaging and accessible learning environment. Our expert instructors and modern facilities ensure you get the best education, whether you're starting fresh or enhancing existing skills.",
    "We aim not just to teach but to inspire our students to excel and thrive in the tech world.",
    "Thank you for choosing us as your learning partner. Together, let’s build a brighter, digital future!",
    "Tanmay Kauri",
    "Director\nTTSDF FOUNDATION"
  ];

  const typingSpeeds = [100, 20, 20, 20, 20, 50, 50]; // Different speeds for variation

  useEffect(() => {
    let index = 0;
    const setters = [setText1, setText2, setText3, setText4, setText5, setText6, setText7];

    const typeMessage = (msgIndex) => {
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex <= messages[msgIndex].length) {
          setters[msgIndex](messages[msgIndex].substring(0, charIndex));
          charIndex++;
          setTimeout(typeChar, typingSpeeds[msgIndex]);
        } else if (msgIndex + 1 < messages.length) {
          // Start typing the next message after a delay
          setTimeout(() => typeMessage(msgIndex + 1), 500);
        }
      };

      typeChar();
    };

    // Start typing the first message
    setTimeout(() => typeMessage(0), 500);
  }, []);

  return (
    <div className="relative m-10 p-5 max-h-full rounded-lg bg-white">
      <h2 className="text-4xl text-center font-extrabold text-gray-800 mb-10 leading-tight whitespace-nowrap">
      Director's Message
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center">
          <img
            src={DirectorPic}
            alt="Director"
            className="md:w-145 md:h-145 object-cover rounded-full shadow-md"
          />
        </div>
        <div className="text-lg text-gray-700 leading-relaxed">
          {/* Typing Effect for all messages */}
          <p className="text-2xl font-semibold mb-4 text-gray-800">
            {text1}
            {text1.length < messages[0].length && <span className="animate-pulse">|</span>}
          </p>

          <p>{text2}</p>
          <br />
          <p>{text3}</p>
          <br />
          <p>{text4}</p>
          <br />
          <p>{text5}</p>
          <br />
          <p className="font-semibold">{text6}</p>
          <p>{text7.split("\n")[0]}</p>
          <p>{text7.split("\n")[1]}</p>
        </div>
      </div>
    </div>
  );
};

export default DirectorMsg;
