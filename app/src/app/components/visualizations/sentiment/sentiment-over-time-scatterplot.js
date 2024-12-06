"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const EnhancedSentimentScatterplot = () => {
  const chartRef = useRef();
  const [selectedPost, setSelectedPost] = useState(null); // Store selected post

  useEffect(() => {
    if (selectedPost) {
      console.log("Selected Post: ", selectedPost); // Logs the selected post after it changes
    }
  }, [selectedPost]); // Trigger effect when selectedPost changes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Parse the data
        const parsedData = Object.entries(json).map(([postId, post]) => ({
          postId,
          date: new Date(post.date),
          bodyScore: post.bodySentiment.score,
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
    const width = 800 - margin.left - margin.right; // Adjusted width
    const height = 800 - margin.top - margin.bottom; // Adjusted height

    // Clear any existing SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define the date range for the x-axis
    const startDate = new Date("2021-11-01"); // November 2021
    const endDate = new Date("2023-06-30"); // June 2023

    // Filter the data to only include dates within the range
    const filteredData = data.filter(
      (d) => d.date >= startDate && d.date <= endDate
    );

    // Define scales
    const xScale = d3
      .scaleTime()
      .domain([startDate, endDate]) // Set domain to specific date range
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => d.bodyScore) - 10,
        d3.max(filteredData, (d) => d.bodyScore) + 10,
      ])
      .nice()
      .range([height, 0]);

    // Define color scale for sentiment (Negative = Blue, Positive = Pink)
    const colorScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) => d.bodyScore), // Minimum value
        0, // Neutral midpoint
        d3.max(filteredData, (d) => d.bodyScore), // Maximum value
      ])
      .range(["blue", "white", "red"]);

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%b %Y"))
      .ticks(d3.timeMonth.every(2)); // Show every 2 months as ticks

    const yAxis = d3.axisLeft(yScale);

    const legendData = [
      { color: "blue", label: "Negative" },
      { color: "white", label: "Neutral" },
      { color: "red", label: "Positive" },
    ];

    // Append a `defs` (for definition) element to your SVG
    var defs = svg.append("defs");

    // Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs
      .append("linearGradient")
      .attr("id", "linear-gradient");

    // Set the gradient direction to be horizontal
    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Use `legendData` to define gradient color stops
    legendData.forEach((item, index) => {
      linearGradient
        .append("stop")
        .attr("offset", `${(index / (legendData.length - 1)) * 100}%`)
        .attr("stop-color", item.color);
    });

    // Append a group for the legend and place it in the desired position
    const legendWidth = 200; // Width of the gradient legend
    const legendHeight = 20; // Height of the gradient legend

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 250}, ${height - 30})`);

    // Add the gradient rectangle for the legend
    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)");

    // Add labels for the legend
    legend
      .append("text")
      .attr("x", -10)
      .attr("y", legendHeight / 2 + 5)
      .attr("text-anchor", "end")
      .attr("fill", "#333")
      .style("font-size", "12px")
      .text(legendData[0].label); // Negative label

    legend
      .append("text")
      .attr("x", legendWidth + 10)
      .attr("y", legendHeight / 2 + 5)
      .attr("text-anchor", "start")
      .attr("fill", "#333")
      .style("font-size", "12px")
      .text(legendData[legendData.length - 1].label);

    //Horizontal gradient
    linearGradient
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    // Add X Axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y Axis
    svg.append("g").call(yAxis);

    // ** Neutral Line (at y = 0) **
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(0)) // Neutral line (sentiment score 0)
      .attr("y2", yScale(0))
      .attr("stroke", "#ccc")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    // ** Add Grid Lines **
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

    // Scatterplot points
    const circles = svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.bodyScore))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d.bodyScore)) // Apply color scale based on sentiment score
      .attr("opacity", 0.7)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .on("click", (event, d) => {
        setSelectedPost(d); // Show post details
        circles.attr("stroke-width", 0.5);
        d3.select(event.currentTarget).attr("stroke-width", 3);

        setSelectedPost(d);
      })
      .on("mouseover", (event, d) => {
        // Show tooltip on hover
        showTooltip(event, d);
      })
      .on("mouseout", () => {
        // Hide tooltip
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
      const [x, y] = [event.clientX, event.clientY]; // Get the mouse position in client space

      // Prevent tooltip from being clipped at the right edge
      const tooltipWidth = 250; // Approximate tooltip width
      const tooltipHeight = 100; // Approximate tooltip height

      const tooltipX = x + 10; // Default left position
      const tooltipY = y + 10; // Default top position

      // Check if the tooltip will go off-screen to the right
      const rightOverflow = tooltipX + tooltipWidth > window.innerWidth;
      const adjustedX = rightOverflow
        ? window.innerWidth - tooltipWidth - 10
        : tooltipX;

      // Check if the tooltip will go off-screen at the bottom
      const bottomOverflow = tooltipY + tooltipHeight > window.innerHeight;
      const adjustedY = bottomOverflow
        ? window.innerHeight - tooltipHeight - 10
        : tooltipY;

      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html(
          `<strong>${
            d.postTitle
          }</strong><br>Sentiment Score: ${d.bodyScore.toFixed(2)}`
        )
        .style("left", `${adjustedX}px`)
        .style("top", `${adjustedY}px`);
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

export default EnhancedSentimentScatterplot;
