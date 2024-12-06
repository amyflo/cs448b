"use client";

import React, { useState, useEffect, useRef } from "react";

const ScrollSlideshow = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = React.Children.count(children);
  const containerRef = useRef(null);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const newSlide = Math.round(scrollTop / clientHeight);

    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < totalSlides) {
      setCurrentSlide(newSlide);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [currentSlide]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-y-scroll"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <div className="flex flex-col items-center justify-center">
        {React.Children.map(children, (child, index) => (
          <div
            className={`w-full min-h-[95vh] p-10 bg-white shadow-lg rounded-lg overflow-hidden transition-opacity duration-500 ${
              index === currentSlide
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-50 translate-y-5 scale-95"
            }`}
            style={{
              scrollSnapAlign: "start",
              transition: "opacity 0.5s, transform 0.5s ease-in-out",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollSlideshow;
