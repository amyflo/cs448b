"use client";

import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/30 backdrop-blur-md text-black z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo or Title */}
        <div className="text-lg font-bold">
          <Link href="/" className="flex items-center space-x-2 group">
            {/* Heart Logo */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-pink-300 group-hover:text-pink-500 transition duration-200"
            >
              <path d="M12 4.248C8.852-1.154 0 .423 0 7.192c0 4.661 5.571 9.427 12 15.808 6.429-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
            </svg>
            {/* Text */}
            <span className="text-lg text-gray-800 group-hover:text-pink-600 transition duration-200">
              Exploring r/LoveLetters
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-sm md:text-base">
          <li>
            <Link
              href="about"
              className="text-pink-500 hover:text-pink-600 relative transition duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <a
              href="https://www.reddit.com/r/LoveLetters"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-600 relative transition duration-200"
            >
              r/LoveLetters
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-pink-500 scale-x-0 origin-left transition-transform duration-200 hover:scale-x-100"></span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
