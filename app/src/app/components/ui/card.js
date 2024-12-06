import React from "react";
import ReactMarkdown from "react-markdown";

const Card = ({ children, title, description }) => {
  return (
    <div className="flex flex-col p-4 items-center justify-center">
      <div className="max-w-prose">
        <ReactMarkdown className="font-serif text-2xl">{title}</ReactMarkdown>
        <ReactMarkdown
          className="font-serif text-md text-gray-800 leading-relaxed"
          breaks
        >
          {description}
        </ReactMarkdown>
      </div>
      <div
        className="bg-white w-3/4 rounded-lg flex-1 flex items-center justify-center"
        id="visualization-content"
      >
        {children}
      </div>
    </div>
  );
};

export default Card;
