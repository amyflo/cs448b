import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const HorizontalBarChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Parse and aggregate data
        const parsedData = Object.entries(json)
          .map(([, post]) => ({
            // Use the second element of the pair
            topic: post.topic_label,
            sentiment: post.bodySentiment?.score || 0,
            length: post.body?.split(" ").length || 0,
          }))
          .filter((post) => post.topic);

        const aggregatedData = d3.rollups(
          parsedData,
          (posts) => ({
            numPosts: posts.length,
            avgSentiment: d3.mean(posts, (d) => d.sentiment),
            avgLength: d3.mean(posts, (d) => d.length),
          }),
          (d) => d.topic
        );

        setData(
          aggregatedData.map(([topic, stats]) => ({
            topic,
            ...stats,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const createBubbleChart = (chartData, containerId) => {
    d3.select(`#${containerId}`).select("svg").remove();

    const margin = { top: 60, right: 300, bottom: 60, left: 100 };
    const width = 1200 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select(`#${containerId}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.numPosts)])
      .nice()
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.avgLength)]) // Y-axis represents word length
      .nice()
      .range([height, 0]);

    const sizeScale = d3
      .scaleSqrt()
      .domain([
        d3.min(chartData, (d) => d.avgSentiment),
        d3.max(chartData, (d) => d.avgSentiment),
      ])
      .range([5, 30]); // Bubble size represents sentiment

    const colorScale = d3
      .scaleOrdinal(d3.schemeTableau10) // Use categorical colors for topics
      .domain(chartData.map((d) => d.topic));

    // Axes
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(10));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10) // Adjust based on margin
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Number of Posts");

    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20) // Adjust based on margin
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Average word count");

    const gridGroup = svg.append("g").attr("class", "grid");

    // Horizontal gridlines (y-axis)
    gridGroup
      .selectAll(".horizontal-gridline")
      .data(yScale.ticks(10))
      .enter()
      .append("line")
      .attr("class", "horizontal-gridline")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3"); // Dashed lines

    // Vertical gridlines (x-axis)
    gridGroup
      .selectAll(".vertical-gridline")
      .data(xScale.ticks(10))
      .enter()
      .append("line")
      .attr("class", "vertical-gridline")
      .attr("x1", (d) => xScale(d))
      .attr("x2", (d) => xScale(d))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#e0e0e0")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3");

    // Bubbles
    svg
      .selectAll(".bubble")
      .data(
        chartData.sort(
          (a, b) => sizeScale(b.avgSentiment) - sizeScale(a.avgSentiment)
        )
      ) // Sort data by bubble size (descending)
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", (d) => xScale(d.numPosts)) // X-axis is number of posts
      .attr("cy", (d) => yScale(d.avgLength)) // Y-axis is average word length
      .attr("r", (d) => sizeScale(d.avgSentiment)) // Bubble size is sentiment
      .attr("fill", (d) => colorScale(d.topic)) // Color represents topic
      .attr("opacity", 0.5)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `<strong>${d.topic}</strong><br>
             Average Sentiment Score: ${d.avgSentiment.toFixed(2)}<br>
             Average word count: ${d.avgLength.toFixed(1)} words<br>
             Total number of posts: ${d.numPosts}`
          )
          .style("left", `${event.clientX}px`) // Offset horizontally by 10px
          .style("top", `${event.clientY - 100}px`); // Offset vertically by 10px
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
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

    // Chart title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Sentiment, Average Length, and Number of Posts by Topic");

    // Legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 100}, 20)`);

    // Topic color legend
    legend
      .append("text")
      .text("Topics")
      .attr("font-size", "12px")
      .attr("dy", "0em")
      .attr("font-weight", "bold");

    chartData.forEach((d, i) => {
      legend
        .append("circle")
        .attr("cx", 10)
        .attr("cy", 20 + i * 20)
        .attr("r", 5)
        .attr("fill", colorScale(d.topic));

      legend
        .append("text")
        .attr("x", 25)
        .attr("y", 20 + i * 20 + 5)
        .attr("font-size", "10px")
        .text(d.topic);
    });

    // Bubble size legend
    const sentimentLegendSizes = [
      d3.min(chartData, (d) => d.avgSentiment),
      d3.median(chartData, (d) => d.avgSentiment),
      d3.max(chartData, (d) => d.avgSentiment),
    ];
    legend
      .append("text")
      .text("Sentiment Score")
      .attr("font-size", "12px")
      .attr("dy", `${chartData.length * 20 + 30}px`)
      .attr("font-weight", "bold");

    sentimentLegendSizes.forEach((size, i) => {
      const scaledRadius = sizeScale(size); // Dynamically calculate the scaled radius
      const spacing = scaledRadius * 2; // Space between circles is twice the radius + padding

      legend
        .append("circle")
        .attr("cx", 10)
        .attr("cy", 30 + chartData.length * 20 + 10 + i * spacing) // Use dynamic spacing
        .attr("r", scaledRadius)
        .attr("fill", "none")
        .attr("stroke", "black");

      legend
        .append("text")
        .attr("x", 50)
        .attr("y", 30 + chartData.length * 20 + 10 + i * spacing + 5) // Align text with the circle
        .attr("font-size", "10px")
        .text(`${size.toFixed(2)}`);
    });
  };
  useEffect(() => {
    if (data.length > 0) {
      createBubbleChart(data, "bubble-chart");
    }
  }, [data]);

  return (
    <div className="flex flex-column">
      <div id="bubble-chart" style={{ marginBottom: "2rem" }}></div>
    </div>
  );
};

export default HorizontalBarChart;
