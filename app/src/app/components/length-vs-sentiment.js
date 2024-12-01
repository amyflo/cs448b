"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const InteractiveBoxPlot = () => {
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        const parsedData = Object.entries(json).map(([postId, post]) => ({
          postId,
          postLength: post.bodySentiment?.tokens?.length || 0, // Use token count for post length
          bodyScore: post.bodySentiment?.score || 0, // Body sentiment score
        }));

        renderBoxPlot(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderBoxPlot = (data) => {
    const margin = { top: 50, right: 30, bottom: 70, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear existing SVG
    d3.select(chartRef.current).select("svg").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Tooltip
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("opacity", 0)
      .style("pointer-events", "none");

    // Create post length ranges
    const bins = [0, 500, 1000, Infinity];
    const labels = ["0-500", "500-1000", "1000+"];
    const groupedData = labels.map((label, i) => ({
      range: label,
      data: data.filter(
        (d) => d.postLength > bins[i] && d.postLength <= bins[i + 1]
      ),
    }));

    // Scales
    const xScale = d3.scaleBand().domain(labels).range([0, width]).padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.bodyScore) - 10,
        d3.max(data, (d) => d.bodyScore) + 10,
      ])
      .range([height, 0]);

    // Add X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Add Y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Add Boxplot Elements for Each Group
    groupedData.forEach((group) => {
      const values = group.data.map((d) => d.bodyScore);

      if (values.length === 0) return;

      // Compute summary statistics
      const q1 = d3.quantile(values, 0.25);
      const median = d3.quantile(values, 0.5);
      const q3 = d3.quantile(values, 0.75);
      const iqr = q3 - q1;
      const lowerFence = Math.max(d3.min(values), q1 - 1.5 * iqr);
      const upperFence = Math.min(d3.max(values), q3 + 1.5 * iqr);

      const x = xScale(group.range) + xScale.bandwidth() / 2;
      const boxWidth = xScale.bandwidth() * 0.5;

      // Draw the box
      svg
        .append("rect")
        .attr("x", x - boxWidth / 2)
        .attr("y", yScale(q3))
        .attr("width", boxWidth)
        .attr("height", yScale(q1) - yScale(q3))
        .attr("fill", "#69b3a2")
        .attr("opacity", 0.7)
        .on("mouseover", () => {
          tooltip.style("opacity", 1).html(
            `<strong>Range:</strong> ${group.range}<br>
               <strong>Median:</strong> ${median.toFixed(2)}<br>
               <strong>Q1:</strong> ${q1.toFixed(2)}<br>
               <strong>Q3:</strong> ${q3.toFixed(2)}`
          );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));

      // Draw the median line
      svg
        .append("line")
        .attr("x1", x - boxWidth / 2)
        .attr("x2", x + boxWidth / 2)
        .attr("y1", yScale(median))
        .attr("y2", yScale(median))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Draw whiskers
      svg
        .append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", yScale(lowerFence))
        .attr("y2", yScale(upperFence))
        .attr("stroke", "black")
        .attr("stroke-width", 1);

      // Draw outliers
      group.data.forEach((d) => {
        if (d.bodyScore < lowerFence || d.bodyScore > upperFence) {
          svg
            .append("circle")
            .attr("cx", x)
            .attr("cy", yScale(d.bodyScore))
            .attr("r", 3)
            .attr("fill", "red");
        }
      });
    });

    // Title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Interactive Sentiment Scores by Post Length Ranges");
  };

  return <div ref={chartRef}></div>;
};

export default InteractiveBoxPlot;
