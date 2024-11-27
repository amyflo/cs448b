"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const SentimentHeatmap = () => {
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/sentiment-analysis/results.json");
        const json = await response.json();

        const parsedData = json.map((post) => ({
          date: new Date(post.date),
          bodyScore: post.bodySentiment.score,
        }));

        renderHeatmap(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderHeatmap = (data) => {
    const margin = { top: 50, right: 30, bottom: 70, left: 80 };
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

    // Binning for x (time) and y (sentiment)
    const xBins = d3.timeMonth.every(1); // Monthly bins

    const yBins = d3.range(
      d3.min(data, (d) => Math.floor(d.bodyScore / 10) * 10),
      d3.max(data, (d) => Math.ceil(d.bodyScore / 10) * 10) + 10,
      10
    ); // Sentiment bins of size 10

    // Scale for x-axis (time)
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    // Scale for y-axis (sentiment)
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(yBins), d3.max(yBins)])
      .range([height, 0]);

    // Binned data
    const bins = d3
      .bin()
      .value((d) => d.bodyScore)
      .thresholds(yBins); // Bins for sentiment

    const timeGrouped = d3.group(data, (d) => xBins(d.date));
    const binnedData = Array.from(timeGrouped, ([time, points]) => ({
      time: new Date(time),
      bins: bins(points),
    }));

    // Color scale for density
    const colorScale = d3
      .scaleSequential()
      .interpolator(d3.interpolateOrRd)
      .domain([0, d3.max(binnedData, (d) => d.bins.length)]);

    // Draw cells
    binnedData.forEach((group) => {
      const x = xScale(group.time); // Position for the time interval
      group.bins.forEach((bin) => {
        if (bin.length > 0) {
          // Only render bins with data
          const y = yScale(bin.x0); // Lower bound of the sentiment bin
          const binHeight = Math.abs(yScale(bin.x1) - yScale(bin.x0));
          const density = bin.length; // Number of points in this bin

          console.log(
            `Density: ${density}, x0: ${bin.x0}, x1: ${bin.x1}, y: ${y}, height: ${binHeight}`
          );

          svg
            .append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width / binnedData.length - 1) // Width adjusted for gaps
            .attr("height", binHeight)
            .attr("fill", colorScale(density)) // Color based on density
            .attr("stroke", "white")
            .attr("stroke-width", 0.5);
        }
      });
    });

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %Y")))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Color Legend
    const legendWidth = 200;
    const legendHeight = 10;
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - legendWidth - 20},${-40})`);

    // Gradient for legend
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d3.interpolateOrRd(0));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d3.interpolateOrRd(1));

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)");

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .text("Low Density");

    legend
      .append("text")
      .attr("x", legendWidth)
      .attr("y", -5)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .text("High Density");
  };

  return <div ref={chartRef}></div>;
};

export default SentimentHeatmap;
