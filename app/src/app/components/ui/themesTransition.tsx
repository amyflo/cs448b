"use client";

import React, { useEffect, useState } from "react";

interface TopicObjectType {
  topic: number;
  top_words: string[];
  num_letters_assigned: number;
  label: string;
  description: string;
  color: string;
}

const ThemesTransition: React.FC = () => {
  const [themes, setThemes] = useState<TopicObjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // fetch the topic data
  const topicFilePath = "/data/topic-modeling/results/topics_NMF_15.json";

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        // fetch the themes, load the data
        const response = await fetch(topicFilePath);
        const topicData = await response.json();
        // reformat topics
        console.log("fetched topics: ", topicData);
        setThemes(topicData);
      } catch (error) {
        console.log("failed fetching themes: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchThemes();
  }, []);

  if (isLoading) {
    return <p>Loading Themes...</p>;
  }

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
            {/* heart on top of header */}
            <div className="flex justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={theme.color} // can change to "currentcolor" to get pink theme color if multicolor is ugly
                className="w-5 h-5 text-pink-300 group-hover:text-pink-500 transition duration-200 opacity-70"
              >
                <path d="M12 4.248C8.852-1.154 0 .423 0 7.192c0 4.661 5.571 9.427 12 15.808 6.429-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z" />
              </svg>
            </div>
            <h2 className="font-bold text-base mb-2">{theme.label}</h2>{" "}
            <p className="text-sm text-gray-600">{theme.description}</p>{" "}
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
