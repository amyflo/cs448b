"use client";

import React from "react";

interface TransitionScreenProps {
  title?: string;
  description?: string;
  gradient?: string;
}

const TransitionScreen: React.FC<TransitionScreenProps> = ({
  title = "Welcome",
  description = "Dive into heartfelt stories of love, gratitude, and heartbreak from an online community.",
  gradient = "bg-gradient-to-b from-white via-pink-100 to-white",
}) => {
  return (
    <div
      className={`w-screen rounded-xl h-screen flex flex-col items-center justify-center ${gradient} text-center relative overflow-hidden`}
    >
      {/* Add Keyframes for Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(-20px, -30px);
          }
          50% {
            transform: translate(20px, -50px);
          }
          75% {
            transform: translate(-10px, -30px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      {/* Left Blur Gradient */}
      <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-white to-pink-200 backdrop-blur-md pointer-events-none z-0"></div>

      <div className="absolute inset-0 z-0 overflow-hidden animate-pulse">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="absolute opacity-50"
            style={{
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full text-pink-400"
            >
              <path d="M12 4.248C8.852-1.154 0 .423 0 7.192c0 4.661 5.571 9.427 12 15.808 6.429-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Title */}
      <h1
        className="relative z-10 text-5xl md:text-6xl font-serif font-extrabold text-pink-600 mb-6 drop-shadow-lg text-center mx-auto"
        style={{
          animation: "fadeIn 1s ease-in-out",
          maxWidth: "70%", // Reduced max width for narrower appearance
          wordWrap: "break-word", // Ensure long words wrap properly
        }}
      >
        {title}
      </h1>

      {/* Description */}
      <p
        className="max-w-xl relative z-10 text-lg md:text-xl text-gray-800 font-serif font-light text-center leading-relaxed text-left"
        style={{
          animation: "fadeIn 1s ease-in-out",
          animationDelay: "0.5s",
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default TransitionScreen;
