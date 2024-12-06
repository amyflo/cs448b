"use client";

import React, { useState, useEffect, useRef } from "react";

const ScrollSlideshow = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(
      0,
      React.Children.count(children)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = slideRefs.current.indexOf(entry.target);
            if (index !== -1) setCurrentSlide(index);
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5, // Adjust as needed to detect when 50% of a slide is visible
      }
    );

    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      slideRefs.current.forEach((slide) => {
        if (slide) observer.unobserve(slide);
      });
    };
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll scrollbar-hide"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <div className="flex flex-col items-center">
        {React.Children.map(children, (child, index) => (
          <div
            ref={(el) => (slideRefs.current[index] = el)}
            className={`w-full p-10 bg-white overflow-hidden transition-opacity duration-500 ${
              index === currentSlide
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-50 translate-y-5 scale-95"
            }`}
            style={{
              minHeight: "50vh", // Adjust minimum height for smaller slides
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
