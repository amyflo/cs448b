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
      .text("Post Length (words)");

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
           Post Length: ${d.postLength} words<br>
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
              <p>Sentiment Score: {selectedPost.bodyScore}</p>
              <a
                href={selectedPost.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0077cc" }}
              >
                View on Reddit
              </a>
              <hr />

              <div style={{ overflowY: "auto", maxHeight: "80vh" }}>
                <p>{selectedPost.postTitle}</p>
                <p>{selectedPost.postBody}</p>
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
