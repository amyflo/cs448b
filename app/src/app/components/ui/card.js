import React from "react";
import ReactMarkdown from "react-markdown";

const Card = ({ children, title, description }) => {
  return (
    <div className="flex flex-row gap-8 items-center justify-center">
      <div
        className="bg-white w-full max-w-2/3 rounded-lg flex-1 flex items-center justify-center p-4"
        id="visualization-content"
      >
        {children}
      </div>
      <div className="w-1/3 max-w-sm">
        <ReactMarkdown className="font-bold text-xl mb-2">
          {title}
        </ReactMarkdown>
        <ReactMarkdown className="text-gray-600" breaks>
          {description}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Card;
