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
      className={`w-full h-screen flex flex-col items-center justify-center ${gradient} text-center`}
    >
      <h1 className="text-5xl font-serif font-extrabold text-pink-600 mb-6 drop-shadow-lg">
        {title}
      </h1>
      <p className="text-lg text-gray-800 font-serif font-light leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
};

export default TransitionScreen;
