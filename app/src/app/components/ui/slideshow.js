"use client";

import React, { useState } from "react";

const Slideshow = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Total slides
  const totalSlides = React.Children.count(children);

  // Navigate to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  // Navigate to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="relative flex items-center justify-center h-full w-full">
      {/* Slideshow Content */}
      <div className="w-full h-screen p-20 bg-white">
        {React.Children.toArray(children)[currentSlide]}
      </div>

      {/* Previous Button */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-4 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          style={{ transform: "translateY(-50%)" }}
          aria-label="Previous Slide"
        >
          &#8592; {/* Left arrow */}
        </button>
      )}

      {/* Next Button */}
      {currentSlide < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-4 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          style={{ transform: "translateY(-50%)" }}
          aria-label="Next Slide"
        >
          &#8594; {/* Right arrow */}
        </button>
      )}
    </div>
  );
};

export default Slideshow;
