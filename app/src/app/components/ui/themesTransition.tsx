"use client";

import React from "react";

interface ThemesTransitionScreenProps {
  themes: string[];
  gradient?: string;
}

const ThemesTransition: React.FC<ThemesTransitionScreenProps> = ({
  themes,
  gradient = "bg-gradient-to-b from-white via-pink-50 to-pink-100",
}) => {
  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-12`}
    >
      <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-pink-600 mb-8 drop-shadow-lg">
        15 topics define r/LoveLetters.
      </h1>
      <p className="font-serif text-lg md:text-xl text-gray-700 font-light leading-relaxed max-w-3xl mb-12">
        Each topic captures a unique aspect of love letters, ranging from
        reflections on relationships to moments of vulnerability and heartfelt
        goodbyes.
      </p>
      <div className="font-serif grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {themes.map((theme, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-800 font-medium text-sm md:text-base"
          >
            {theme}
          </div>
        ))}
      </div>
      <p className="font-serif mt-12 text-lg text-gray-600 max-w-2xl">
        These themes helped uncover patterns and insights about how love,
        emotions, and relationships are expressed in r/LoveLetters.
      </p>
    </div>
  );
};

export default ThemesTransition;
