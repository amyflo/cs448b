"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const EnhancedSentimentScatterplot = () => {
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/sentiment-analysis/results.json");
        const json = await response.json();

        const parsedData = json.map((post) => ({
          postId: post.postId,
          date: new Date(post.date),
          bodyScore: post.bodySentiment.score,
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
    const height = 500 - margin.top - margin.bottom;

    // Clear any existing SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.bodyScore) - 10, // Add padding
        d3.max(data, (d) => d.bodyScore) + 10,
      ])
      .nice()
      .range([height, 0]);

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .tickFormat(d3.timeFormat("%b %Y"))
      .ticks(10);

    const yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(yAxis);

    // Add guideline for sentiment = 0
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(0)) // yScale maps 0 to the appropriate height
      .attr("y2", yScale(0))
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4,4") // Dashed line
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.7);

    // Add label for guideline
    svg
      .append("text")
      .attr("x", width - 10)
      .attr("y", yScale(0) - 10)
      .attr("text-anchor", "end")
      .style("fill", "red")
      .style("font-size", "12px")
      .text("Neutral Sentiment (0)");

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Sentiment Analysis: Body Sentiment Over Time");

    // Tooltip
    const tooltip = d3
      .select("body") // Append to the body
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Scatterplot Points
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.bodyScore))
      .attr("r", 6)
      .attr("fill", (d) =>
        d.bodyScore < 0 ? d3.interpolateRdYlBu(0.1) : d3.interpolateRdYlBu(0.9)
      ) // Gradient color scheme
      .attr("opacity", 0.7)
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .on("mouseover", (event, d) => {
        tooltip
          .html(
            `<strong>Date:</strong> ${d3.timeFormat("%b %d, %Y")(d.date)}<br>
             <strong>Body Sentiment Score:</strong> ${d.bodyScore.toFixed(2)}`
          )
          .style("opacity", 1)
          .style("left", `${event.pageX + 10}px`) // Position relative to the mouse
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mousemove", (event) => {
        // Update tooltip position dynamically
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Legend
    const legendData = [
      { label: "Negative Sentiment", color: d3.interpolateRdYlBu(0.1) },
      { label: "Positive Sentiment", color: d3.interpolateRdYlBu(0.9) },
    ];

    const legend = svg
      .selectAll(".legend")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => d.color);

    legend
      .append("text")
      .attr("x", width - 28)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d.label);
  };

  return <div ref={chartRef} style={{ position: "relative" }}></div>;
};

export default EnhancedSentimentScatterplot;
