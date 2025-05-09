import React from "react";
import Acc1 from "../assets/acc1.jpeg";
import Acc2 from "../assets/acc2.jpeg";
import Acc3 from "../assets/acc3.jpeg";
import Acc4 from "../assets/acc4.jpeg";
import Acc5 from "../assets/acc5.jpeg";
import Acc6 from "../assets/acc6.jpeg";
import Acc7 from "../assets/acc7.jpeg";

const AffiliatedLogo = () => {
  return (
    <div className="relative md:m-10 md:p-10 my-12 max-h-full  bg-white borde">
      <p className="text-3xl sm:text-5xl text-center font-extrabold text-gray-800 mb-6 leading-tight">
        Affiliated By
      </p>
      <div className="overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {[
            Acc1,
            Acc2,
            Acc3,
            Acc4,
            Acc5,
            Acc6,
            Acc7,
            Acc1,
            Acc2,
            Acc3,
            Acc4,
            Acc5,
            Acc6,
            Acc7,
          ].map((logo, index) => (
            <img
              key={index}
              src={logo}
              alt={`Affiliated Logo ${index + 1}`}
              className="md:mx-10 w-h-22 h-22 object-contain mx-3"
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AffiliatedLogo;
