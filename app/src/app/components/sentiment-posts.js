"use client";

import React, { useEffect, useState } from "react";

const SentimentBoxChart = () => {
  const [data, setData] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null); // Track the hovered post

  useEffect(() => {
    // Fetch the sentiment-results.json file
    const fetchData = async () => {
      try {
        const response = await fetch("/data/sentiment-analysis/results.json");
        const json = await response.json();

        // Map data to include titleScore, bodyScore, and averageCommentScore
        const mappedData = json.map((post) => ({
          postId: post.postId,
          titleScore: post.titleSentiment.score,
          bodyScore: post.bodySentiment.score,
          averageCommentScore: post.averageCommentScore,
        }));
        setData(mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to determine the background color based on scores
  const getBoxColor = (averageScore) => {
    if (averageScore > 1.5) return "#4caf50"; // Green for high scores
    if (averageScore > 0.5) return "#ffc107"; // Yellow for medium scores
    return "#f44336"; // Red for low scores
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2px",
        padding: "20px",
        position: "relative",
      }}
    >
      {data.map((post) => (
        <div
          key={post.postId}
          style={{
            backgroundColor: getBoxColor(post.averageCommentScore),
            // borderRadius: "px",
            width: "20px",
            height: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            transition: "transform 0.3s, box-shadow 0.3s",
          }}
          onMouseEnter={() => setHoveredPost(post)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {/* Post: {post.postId} */}
          </p>

          {/* Tooltip */}
          {hoveredPost?.postId === post.postId && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "#fff",
                padding: "10px",
                borderRadius: "4px",
                top: "110%",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              }}
            >
              <p style={{ margin: "0" }}>
                <strong>Post ID:</strong> {post.postId}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Title Score:</strong> {post.titleScore}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Body Score:</strong> {post.bodyScore}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Avg. Comment Score:</strong>{" "}
                {post.averageCommentScore.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SentimentBoxChart;
