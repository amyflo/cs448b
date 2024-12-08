import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const SentimentBoxPlot = () => {
  const [data, setData] = useState([]);
  const [sortingMethod, setSortingMethod] = useState("median");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Parse the data to extract topic and sentiment
        const parsedData = Object.entries(json)
          .map(([postId, post]) => ({
            topic: post.topic_label, // Assuming `topic` is available in the data
            sentiment: post.bodySentiment?.score || 0,
          }))
          .filter((post) => post.topic);

        setData(parsedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      // Prepare data for visualization
      const groupedData = d3.group(data, (d) => d.topic);

      // Create the box plot visualization here, passing groupedData
      createBoxPlot(groupedData);
    }
  }, [data]);

  const createBoxPlot = (groupedData) => {
    // Clear previous SVG (if exists)
    d3.select("#box-plot").select("svg").remove();

    // Dimensions and margins
    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    const containerWidth =
      document.getElementById("box-plot")?.offsetWidth || window.innerWidth;
    const width = containerWidth - margin.left - margin.right;

    const height = 1000 - margin.top - margin.bottom;

    // Create SVG canvas
    const svg = d3
      .select("#box-plot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data for box plot
    const boxData = Array.from(groupedData, ([topic, values]) => {
      const sentiments = values.map((d) => d.sentiment).sort(d3.ascending);
      const q1 = d3.quantile(sentiments, 0.25);
      const median = d3.quantile(sentiments, 0.5);
      const q3 = d3.quantile(sentiments, 0.75);
      const min = d3.min(sentiments);
      const max = d3.max(sentiments);
      const range = max - min;
      return { topic, q1, median, q3, min, max, range, sentiments };
    });

    boxData.sort((a, b) => b.median - a.median);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Sentiment, Average Length, and Number of Posts by Topic");

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(boxData.map((d) => d.topic))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([d3.min(boxData, (d) => d.min), d3.max(boxData, (d) => d.max)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .attr("class", "grid-lines")
      .selectAll("line")
      .data(yScale.ticks())
      .enter()
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(yScale));

    // Tooltip
    const tooltip = d3
      .select("#box-plot")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add box plots
    svg
      .selectAll(".box")
      .data(boxData)
      .enter()
      .append("g")
      .attr("class", "box")
      .attr(
        "transform",
        (d) => `translate(${xScale(d.topic) + xScale.bandwidth() / 2}, 0)`
      )
      .each(function (d) {
        const box = d3.select(this);

        // Box
        box
          .append("rect")
          .attr("x", -xScale.bandwidth() / 2)
          .attr("width", xScale.bandwidth())
          .attr("y", yScale(d.q3))
          .attr("height", yScale(d.q1) - yScale(d.q3))
          .attr("fill", "#69b3a2")
          .attr("stroke", "black")
          .on("mouseover", (event) => {
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip
              .html(
                `<strong>${d.topic}</strong><br>
                Q1: ${d.q1.toFixed(2)}<br>
                Median: ${d.median.toFixed(2)}<br>
                Q3: ${d.q3.toFixed(2)}<br>
                Min: ${d.min.toFixed(2)}<br>
                Max: ${d.max.toFixed(2)}<br>
                Range: ${d.range.toFixed(2)}`
              )
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 40}px`);
          })
          .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0);
          });

        // Median line
        box
          .append("line")
          .attr("x1", -xScale.bandwidth() / 2)
          .attr("x2", xScale.bandwidth() / 2)
          .attr("y1", yScale(d.median))
          .attr("y2", yScale(d.median))
          .attr("stroke", "black");

        // Whiskers
        box
          .append("line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", yScale(d.min))
          .attr("y2", yScale(d.q1))
          .attr("stroke", "black")
          .attr("stroke-width", 2);

        box
          .append("text")
          .attr("x", -xScale.bandwidth() / 2)
          .attr("y", yScale(d.min) - 5) // Slightly above the min whisker
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .text(d.min);

        // Max label
        box
          .append("text")
          .attr("x", -xScale.bandwidth() / 2)
          .attr("y", yScale(d.max) + 15) // Slightly below the max whisker
          .attr("text-anchor", "middle")
          .attr("font-size", "16px")
          .text(d.max);
        box
          .append("line")
          .attr("x1", 0)
          .attr("x2", 0)
          .attr("y1", yScale(d.q3))
          .attr("y2", yScale(d.max))
          .attr("stroke", "black");

        // Whisker caps
        box
          .append("line")
          .attr("x1", -xScale.bandwidth() / 4)
          .attr("x2", xScale.bandwidth() / 4)
          .attr("y1", yScale(d.min))
          .attr("y2", yScale(d.min))
          .attr("stroke", "black");

        box
          .append("line")
          .attr("x1", -xScale.bandwidth() / 4)
          .attr("x2", xScale.bandwidth() / 4)
          .attr("y1", yScale(d.max))
          .attr("y2", yScale(d.max))
          .attr("stroke", "black");
      });

    // Add labels

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20)
      .style("text-anchor", "middle")
      .text("Topics");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Sentiment");

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Sentiment Distribution Across Topics");
  };

  return <div id="box-plot"></div>;
};

export default SentimentBoxPlot;
