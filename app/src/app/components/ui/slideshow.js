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
        threshold: 0.5, // Adjust to fine-tune visibility detection
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
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div
          ref={(el) => (slideRefs.current[index] = el)}
          className={`w-full flex items-center justify-center bg-white overflow-hidden transition-opacity duration-500 ${
            index === currentSlide
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-50 translate-y-5 scale-95"
          }`}
          style={{
            minHeight: "100vh", // Ensures each slide fills the viewport
            scrollSnapAlign: "start", // Aligns the slide with the start of the container
            transition: "opacity 0.5s, transform 0.2s ease-in-out",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default ScrollSlideshow;
