import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import { useAuth } from "../../context/AppContext";
import axios from "axios";
import QRCode from "react-qr-code";
import coeTemplate from "../../assets/certificate_template.png";
import marksheetTemplate from "../../assets/marksheet_template.png";
import typingTemplate from "../../assets/Typing_Certificate.png";

function CombinedCertificate() {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const coeRef = useRef(null);
  const marksheetRef = useRef(null);
  const typingRef = useRef(null);
  const { url } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/api/v1/get-user-by-id`,
        { userId },
        { withCredentials: true }
      );
      if (res.data?.success) {
        setUserData(res.data.data);
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching user data");
    }
  };
  const splitContent = (text) => {
    const result = [];
    let current = "";
    let parens = 0;

    for (let char of text) {
      if (char === "(") parens++;
      if (char === ")") parens--;

      if (char === "," && parens === 0) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      result.push(current.trim());
    }

    return result;
  };

  const calculateEndDate = () => {
    try {
      const months = parseInt(userData?.courseDuration?.split(" ")[0]);
      const start = new Date(userData?.dor);
      if (isNaN(months) || isNaN(start)) return "Invalid date";
      start.setMonth(start.getMonth() + months);
      return start.toISOString().split("T")[0];
    } catch {
      return "Invalid date";
    }
  };

  const downloadAllCertificates = async () => {
    const pdfDoc = await PDFDocument.create();

    const refs = [coeRef, marksheetRef, typingRef];

    for (const ref of refs) {
      const canvas = await html2canvas(ref.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgBytes = await fetch(imgData).then((res) => res.arrayBuffer());
      const img = await pdfDoc.embedJpg(imgBytes);

      const page = pdfDoc.addPage([canvas.width, canvas.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${userData.userId}_All_Certificates.pdf`);
  };

  return (
    <div className="p-8">
      <div>
        <form
          onSubmit={handleSubmit}
          className="mb-8 flex flex-wrap justify-center items-center gap-4"
        >
          <input
            type="text"
            placeholder="Enter Registration Number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onPaste={(e) => {
              e.preventDefault();
              const cleaned = e.clipboardData
                .getData("Text")
                .replace(/\s+/g, "");
              setUserId(cleaned);
            }}
            className="px-4 py-2 text-base w-[280px] border border-gray-300 rounded-2xl bg-blue-100"
          />
          <button
            type="submit"
            className="px-6 py-2 text-base font-medium text-white rounded-2xl duration-300 bg-blue-600 hover:bg-blue-800 cursor-pointer transition-all "
          >
            Submit
          </button>
        </form>
      </div>

      {userData && (
        <>
          {/* COE Certificate */}
          <div ref={coeRef} className="relative w-full max-w-4xl mx-auto my-6">
            <img
              src={coeTemplate}
              alt="COE"
              className="w-full h-auto object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full text-black p-4 sm:p-8 font-medium">
              <div className="absolute font-bold text-[12px] top-[35%] left-[50%]">
                {userData.name}
              </div>

              <div className="absolute font-bold text-[12px] top-[41.1%] left-[50%]">
                {userData.fathername}
              </div>

              <div className="absolute font-bold text-[12px]  top-[47.2%] left-[54%]">
                {userData.courseName}
              </div>

              <div className="absolute font-bold text-[12px] top-[53.3%] left-[44%]">
                {userData.branchName}
              </div>

              <div className="absolute font-bold text-[12px]  top-[65.7%] left-[49%]">
                {userData.userId}
              </div>

              <div className="absolute font-bold text-[15px] top-[59.2%] left-[25%]">
                {userData.courseDuration.split(" ")[0]}
              </div>

              <div className="absolute font-bold text-[12px]  top-[59.3%] left-[53%]">
                {userData.dor}
              </div>
              <div className="absolute font-bold text-[12px]  top-[59.3%] left-[73%]">
                {calculateEndDate()}
              </div>

              <div className="absolute font-bold text-[12px] top-[65.4%] left-[19%]">
                {userData.grade}
              </div>

              <div className="absolute font-bold text-[12px] top-[65.6%] left-[79%]">
                {new Date().toLocaleDateString("en-CA")}
              </div>

              <div className="absolute bottom-[26rem] right-[5.5rem]">
                <QRCode
                  value={`${url}/verify/${encodeURIComponent(
                    userData?.userId
                  )}`}
                  size={80}
                />
              </div>
            </div>
          </div>

          {/* Marksheet */}
          <div
            ref={marksheetRef}
            className="relative w-full max-w-4xl mx-auto my-6"
          >
            <img
              src={marksheetTemplate}
              alt="Marksheet"
              className="w-full h-auto object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full p-4 sm:p-8 font-bold">
              <div className="absolute top-[24%] left-[19%] text-[17px]">
                {userData.name}
              </div>
              <div className="absolute top-[24%] left-[68%] text-[17px]">
                {userData.fathername}
              </div>
              <div className="absolute top-[30%] left-[68%] text-[17px]">
                {userData.courseName}
              </div>
              <div className="absolute top-[30%] left-[15%] text-[16px]">
                {userData.userId}
              </div>
              <div className="absolute top-[35.5%] left-[25%] text-[17px]">
                {userData.courseDuration}
              </div>
              <div className="absolute top-[35.2%] left-[60%] text-[16px]">
                {userData.dor} - {calculateEndDate()}
              </div>
              <div className="absolute top-[78.1%] left-[85%] text-[17px]">
                {userData.grade}
              </div>
              <div className="absolute top-[52%] left-[84%] text-sm">
                {userData.theory}
              </div>
              <div className="absolute top-[67%] left-[84%] text-sm">
                {userData.practical}
              </div>
              <div className="absolute top-[78.2%] left-[55%] text-[17px]">
                {100}
              </div>
              <div className="absolute top-[78.2%] left-[70%] text-[17px]">
                {userData.totalmarks}
              </div>

              <ul className="absolute top-[45%] left-[12%] w-[35%] text-[13.5px] list-disc pl-5 ">
                {splitContent(userData.courseContent).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Typing Certificate */}
          <div
            ref={typingRef}
            className="relative w-full max-w-4xl mx-auto my-6"
          >
            <img
              src={typingTemplate}
              alt="Typing"
              className="w-full h-auto object-cover"
            />

            <div className="absolute top-0 left-0 w-full h-full text-black p-4 sm:p-8 font-bold ">
              <div className="absolute top-[35%] left-[55%] text-[14px]">
                {userData.name}
              </div>
              <div className="absolute top-[41.5%] left-[57%] text-[14px]">
                {userData.fathername}
              </div>
              <div className="absolute top-[53%] left-[24%] text-[14px]">
                {userData.typingGrade}
              </div>
              <div className="absolute top-[53.4%] left-[64%] text-[13px]">
                {userData.userId}
              </div>
              <div className="absolute top-[60%] left-[46%] text-[14px]">
                {userData.typingWPM}
              </div>
              <div className="absolute top-[60%] left-[68%] text-[14px]">
                {userData.typingMarks}
              </div>
              <div className="absolute top-[47%] left-[65%] text-[14px]">
                {new Date().toLocaleDateString("en-CA")}
              </div>
            </div>
          </div>

          <button
            onClick={downloadAllCertificates}
            className="mx-auto mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-2xl duration-300 flex cursor-pointer"
          >
            Download All Certificates
          </button>
        </>
      )}
    </div>
  );
}

export default CombinedCertificate;
