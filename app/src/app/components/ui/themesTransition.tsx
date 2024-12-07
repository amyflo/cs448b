"use client";

import React from "react";

interface ThemesTransitionScreenProps {
  themes: string[];
  gradient?: string;
}

const ThemesTransition: React.FC<ThemesTransitionScreenProps> = ({
  themes,
  gradient = "bg-gradient-to-b from-white via-pink-100 to-white",
}) => {
  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center ${gradient} text-center`}
    >
      <h1 className="text-5xl font-serif font-extrabold text-pink-600 mb-6 drop-shadow-lg">
        15 Key Topics were Identified:
      </h1>
      <div className="text-lg text-gray-800 font-serif font-light leading-relaxed max-w-2xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {themes.map((theme, index) => (
            <p key={index} className="mb-2 text-l">
              {theme}
            </p>
          ))}
        </div>
      </div>
      <p className="mb-2 text-xl">
        As a result of our topic-modeling, there were 3 key observations:
      </p>
    </div>
  );
};

export default ThemesTransition;
