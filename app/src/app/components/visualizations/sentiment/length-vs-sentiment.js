"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PostLengthVsSentiment = () => {
  const chartRef = useRef();
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (selectedPost) {
      console.log("Selected Post: ", selectedPost); // Logs the selected post after it changes
    }
  }, [selectedPost]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Parse the data
        const parsedData = Object.entries(json).map(([postId, post]) => ({
          postId,
          postLength: post.body.trim().split(/\s+/).length,
          bodyScore: post.bodySentiment.score, // Sentiment score
          postUrl: `https://www.reddit.com/r/LoveLetters/comments/${postId}`,
          postTitle: post.title,
          postBody: post.body,
          username: post.username,
          createdAt: post.createdAt,
        }));

        renderChart(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (data) => {
    const margin = { top: 60, right: 50, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Sentiment vs. word count of love letters in r/LoveLetters");

    // Define scales
    const xScale = d3
      .scaleLog()
      .domain([
        d3.min(data, (d) => d.postLength),
        d3.max(data, (d) => d.postLength),
      ])
      .range([0, width])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.bodyScore) - 10,
        d3.max(data, (d) => d.bodyScore) + 10,
      ])
      .nice()
      .range([height, 0]);

    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(0)) // Neutral line (sentiment score 0)
      .attr("y2", yScale(0))
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
    // Define color scale for sentiment (Negative = Blue, Positive = Red)
    const colorScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.bodyScore), // Minimum value
        0, // Neutral midpoint
        d3.max(data, (d) => d.bodyScore), // Maximum value
      ])
      .range(["blue", "white", "red"]);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale);

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .append("text")
      .attr("x", width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .text("word count (word count)");

    svg
      .append("g")
      .selectAll(".grid")
      .data(yScale.ticks(10)) // Generate grid lines
      .enter()
      .append("line")
      .attr("class", "grid")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#ddd")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "2,2");

    // Add Y Axis
    svg
      .append("g")
      .call(yAxis)
      .append("text")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("fill", "#333")
      .attr("transform", "rotate(-90)")
      .text("Sentiment Score");

    // Scatterplot points
    const circles = svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.postLength))
      .attr("cy", (d) => yScale(d.bodyScore))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.bodyScore)) // Apply color scale based on sentiment score
      .attr("opacity", 0.7)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .on("click", (event, d) => {
        setSelectedPost(d); // Show post details
        circles.attr("stroke-width", 0.5); // Reset all points
        d3.select(event.currentTarget).attr("stroke-width", 3); // Highlight selected point
      })
      .on("mouseover", (event, d) => {
        showTooltip(event, d);
      })
      .on("mouseout", () => {
        hideTooltip();
      });

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("pointer-events", "none");

    function showTooltip(event, d) {
      const [x, y] = [event.clientX, event.clientY];
      const tooltipWidth = 250;
      const tooltipHeight = 100;

      const tooltipX =
        x + tooltipWidth > window.innerWidth ? x - tooltipWidth - 10 : x + 10;
      const tooltipY =
        y + tooltipHeight > window.innerHeight
          ? y - tooltipHeight - 10
          : y + 10;

      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `<strong>${d.postTitle}</strong><br>
           word count: ${d.postLength} words<br>
           Date: ${new Date(d.createdAt).toLocaleDateString()}<br>
           Sentiment Score: ${d.bodyScore.toFixed(2)}`
        )
        .style("left", `${tooltipX}px`)
        .style("top", `${tooltipY}px`);
    }

    function hideTooltip() {
      tooltip.transition().duration(200).style("opacity", 0);
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        {/* Chart Container */}
        <div ref={chartRef} style={{ flex: 1, position: "relative" }}></div>

        {/* Right-side Panel for Post Details */}
        <div
          style={{
            width: "500px",
            padding: "10px",
            backgroundColor: "#f9f9f9",
            overflowY: "auto",
          }}
        >
          <h2>Post Details</h2>
          {selectedPost ? (
            <>
              <div
                style={{
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  width: "100%",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <strong
                  style={{
                    fontSize: "1.2em",
                    margin: "0 0 10px 0",
                    color: "#333",
                    textAlign: "left",
                  }}
                >
                  {selectedPost.postTitle}
                </strong>
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#777",
                    margin: "0 0 15px 0",
                  }}
                >
                  <strong>{selectedPost.username}</strong> on{" "}
                  {new Date(selectedPost.createdAt).toLocaleDateString()}
                </p>
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#777",
                    margin: "0 0 15px 0",
                  }}
                >
                  Sentiment Score: {selectedPost.bodyScore}
                </p>
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#777",
                    margin: "0 0 15px 0",
                  }}
                >
                  Word count: {selectedPost.postLength}
                </p>
                <p
                  style={{
                    fontSize: "1em",
                    color: "#555",
                    lineHeight: "1.5",
                  }}
                >
                  {selectedPost.postLength > 300
                    ? (selectedPost?.postBody || "").substring(0, 300) + "..."
                    : selectedPost.postBody}
                </p>
                <a
                  href={selectedPost.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  See the original post.
                </a>
              </div>
            </>
          ) : (
            <p>Select a post to see details</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PostLengthVsSentiment;
