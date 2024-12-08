import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  howToUse?: string;
  howItWasCreated?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  howToUse,
  howItWasCreated,
}) => {
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <div className="flex flex-col pt-16 items-center justify-center">
      <div className="max-w-prose pt-24">
        {title && <div className="font-serif font-bold text-xl">{title}</div>}
        {description && (
          <ReactMarkdown className="font-serif text-md text-gray-800 leading-relaxed mt-2">
            {description}
          </ReactMarkdown>
        )}
      </div>
      {/* Info Section */}

      {(howToUse || howItWasCreated) && (
        <div className="mb-4 w-2/3 max-w-prose">
          <div className="flex">
            <div className="flex">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  setIsInfoVisible(!isInfoVisible);
                }}
                className="text-blue-600 hover:underline text-sm flex items-center gap-1"
              >
                {isInfoVisible ? (
                  <>
                    <span>Hide chart information</span>
                    <span>&#9650;</span> {/* Upward caret */}
                  </>
                ) : (
                  <>
                    <span>Learn how to explore this chart</span>
                    <span>&#9660;</span> {/* Downward caret */}
                  </>
                )}
              </a>
            </div>
          </div>
          {isInfoVisible && (
            <div className="mt-2 border-t pt-2 border-gray-300">
              {howToUse && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700">
                    How to Use
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{howToUse}</p>
                </>
              )}
              {howItWasCreated && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700">
                    Explanation
                  </h3>
                  <p className="text-sm text-gray-600">{howItWasCreated}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {children && (
        <div
          className="bg-white p-16 w-screen rounded-lg flex-1 flex items-center justify-center"
          id="visualization-content"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Card;
