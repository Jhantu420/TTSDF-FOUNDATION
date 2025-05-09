import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaWhatsapp,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    const encodedId = encodeURIComponent(userId.trim());
    navigate(`/verify/${encodedId}`);
  };

  return (
    <footer className="bg-gray-900 w-full">
      <div className="max-w-screen-lg px-4 sm:px-6 text-gray-300 sm:grid md:grid-cols-4 sm:grid-cols-2 mx-auto py-6">
        <div className="p-5">
          <h3 className="font-bold text-xl text-purple-600">TTSDF FOUNDATION</h3>
        </div>
        <div className="p-5">
          <h4 className="text-sm uppercase text-purple-600 font-bold">Resources</h4>
          <a className="my-3 block" href="/#">Documentation</a>
          <a className="my-3 block" href="/#">Tutorials</a>
          <a className="my-3 block" href="/#">
            Support <span className="text-teal-600 text-xs p-1">New</span>
          </a>
        </div>
        <div className="p-5">
          <h4 className="text-sm uppercase text-purple-600 font-bold">Support</h4>
          <a className="my-3 block" href="/#">Help Center</a>
          <a className="my-3 block" href="/#">Privacy Policy</a>
          <a className="my-3 block" href="/#">Conditions</a>
        </div>
        <div className="p-5">
          <h4 className="text-sm uppercase text-purple-600 font-bold">Contact us</h4>
          <a className="my-3 block" href="tel:+919679103253">+91 9679103253</a>
          <a className="my-3 block" href="mailto:theryit2024@gmail.com">theryit2024@gmail.com</a>

          {/* ✅ User ID input field */}
          <form onSubmit={handleVerify} className="mt-4">
            <input
              type="text"
              placeholder="Enter User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-2 py-1 rounded-md text-black"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded-md"
            >
              Verify User
            </button>
          </form>
        </div>
      </div>

      <div className="bg-gray-900 pt-2 w-full">
        <div className="flex flex-col items-center pb-5 px-3 m-auto pt-5 border-t text-gray-300 text-sm max-w-screen-lg">
          <div className="flex space-x-4 mt-2">
            <a href="https://www.facebook.com/profile.php/?id=100064500078087" className="text-gray-500 hover:text-purple-600" aria-label="Facebook">
              <FaFacebookF size={24} />
            </a>
            <a href="https://wa.me/message/Y5CRSA7EVPDMB1" className="text-gray-500 hover:text-purple-600" aria-label="WhatsApp">
              <FaWhatsapp size={24} />
            </a>
            <a href="mailto:theryit2024@gmail.com" className="text-gray-500 hover:text-purple-600" aria-label="Email">
              <FaEnvelope size={24} />
            </a>
            <a href="tel:+919679103253" className="text-gray-500 hover:text-purple-600" aria-label="Phone">
              <FaPhoneAlt size={24} />
            </a>
          </div>
          <div className="my-5">© Copyright 2025 TTSDF. All Rights Reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
