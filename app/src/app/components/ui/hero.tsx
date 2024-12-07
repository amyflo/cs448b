import React, { useRef, useEffect } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Set playback speed (0.5 for half-speed)
    }
  }, []);
  return (
    <div className="relative h-screen w-screen flex items-center justify-center text-center text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/reddit-screengrab.mov"
        autoPlay
        loop
        muted
      ></video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 backdrop-blur-sm rounded-lg">
        <h1 className="text-4xl font-serif md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
          Exploring how love is expressed in{" "}
          <span className="text-pink-400">r/LoveLetters</span>
        </h1>
        <p className="text-lg font-serif md:text-xl leading-relaxed mb-8 animate-fade-in delay-500">
          r/LoveLetters is a subreddit where users share heartfelt stories of{" "}
          <span className="text-pink-800">love</span>,{" "}
          <span className="text-pink-800">gratitude</span>, and{" "}
          <span className="text-pink-800">heartbreak</span>.
        </p>
      </div>
    </div>
  );
}
