import React, { useRef, useEffect, useState } from "react";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hearts, setHearts] = useState<
    { x: number; y: number; isClicked?: boolean }[]
  >([]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Set playback speed (0.5 for half-speed)
    }
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    setHearts((prevHearts) => [
      ...prevHearts,
      { x: clientX, y: clientY, isClicked: false },
    ]);

    // Remove hearts after a short delay
    setTimeout(() => {
      setHearts((prevHearts) => prevHearts.slice(1));
    }, 100);
  };

  const handleClick = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    setHearts((prevHearts) => [
      ...prevHearts,
      { x: clientX, y: clientY, isClicked: true },
    ]);

    // Remove big heart after a slightly longer delay
    setTimeout(() => {
      setHearts((prevHearts) => prevHearts.slice(1));
    }, 1200);
  };

  return (
    <div
      className="relative h-screen w-screen flex items-center justify-center text-center text-white overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
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

      {/* Hearts */}
      {hearts.map((heart, index) => (
        <svg
          key={index}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`absolute text-pink-400 opacity-20 ${
            heart.isClicked ? "animate-bigHeart" : "animate-floatUp"
          }`}
          style={{
            width: heart.isClicked ? "40px" : "20px",
            height: heart.isClicked ? "40px" : "20px",
            top: `${heart.y - 10}px`,
            left: `${heart.x - 10}px`,
            zIndex: 1000,
          }}
        >
          <path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
        </svg>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 backdrop-blur-sm rounded-lg">
        <h1 className="text-4xl font-serif md:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in">
          Exploring how love is expressed in{" "}
          <span className="text-pink-400">r/LoveLetters</span>
        </h1>
        <p
          className="max-w-lg mx-auto text-lg font-serif md:text-xl leading-relaxed mb-8 animate-fade-in delay-500"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          r/LoveLetters is a subreddit where users share heartfelt stories of
          love, gratitude, and heartbreak. We explore how r/LoveLetters has{" "}
          <span className="text-pink-600 font-semibold">
            grown and changed over time
          </span>
          , examine{" "}
          <span className="text-pink-600 font-semibold">
            sentiment patterns
          </span>{" "}
          and{" "}
          <span className="text-pink-600 font-semibold">word associations</span>
          , and uncover{" "}
          <span className="text-pink-600 font-semibold">
            themes that emerge across love letters
          </span>
          .
        </p>
      </div>

      {/* Floating Heart Animations */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-50px) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bigHeart {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(3);
            opacity: 0.3;
          }
          100% {
            transform: scale(0.5);
            opacity: 0;
          }
        }

        .animate-floatUp {
          animation: floatUp 1s ease-out forwards;
        }

        .animate-bigHeart {
          animation: bigHeart 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
