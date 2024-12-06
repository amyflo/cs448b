import React from "react";
import ReactMarkdown from "react-markdown";

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
}

const Card: React.FC<CardProps> = ({ children, title, description }) => {
  return (
    <div className="flex flex-col p-4 items-center justify-center">
      <div className="max-w-prose">
        {title && <div className="font-serif font-bold text-xl">{title}</div>}
        {description && (
          <ReactMarkdown className="font-serif text-md text-gray-800 leading-relaxed mt-2">
            {description}
          </ReactMarkdown>
        )}
      </div>
      {children && (
        <div
          className="bg-white w-3/4 rounded-lg flex-1 flex items-center justify-center"
          id="visualization-content"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;
