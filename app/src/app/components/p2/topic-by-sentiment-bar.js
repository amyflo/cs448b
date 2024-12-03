import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const SentimentBarChart = () => {
  const [data, setData] = useState([]);

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

      // Create the bar chart visualization here, passing groupedData
      createBarChart(groupedData);
    }
  }, [data]);

  const createBarChart = (groupedData) => {
    // Clear previous SVG (if exists)
    d3.select("#sentiment-bar-chart").select("svg").remove();

    // Dimensions and margins
    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    const containerWidth =
      document.getElementById("sentiment-bar-chart")?.offsetWidth ||
      window.innerWidth;
    const width = containerWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create SVG canvas
    const svg = d3
      .select("#sentiment-bar-chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate the average sentiment for each topic
    const avgData = Array.from(groupedData, ([topic, values]) => {
      const avgSentiment = d3.mean(values.map((d) => d.sentiment)) || 0; // Compute average sentiment
      return { topic, avgSentiment };
    });

    // Sort the data by average sentiment (descending order)
    avgData.sort((a, b) => b.avgSentiment - a.avgSentiment);

    // Scales
    const xScale = d3
      .scaleBand()
      .domain(avgData.map((d) => d.topic))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(avgData, (d) => d.avgSentiment)])
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
      .select("#sentiment-bar-chart")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Add bars to the bar chart
    svg
      .selectAll(".bar")
      .data(avgData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.topic))
      .attr("y", (d) => yScale(d.avgSentiment))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.avgSentiment))
      .attr("fill", "#69b3a2")
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip
          .html(
            `<strong>${
              d.topic
            }</strong><br>Average Sentiment: ${d.avgSentiment.toFixed(2)}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(200).style("opacity", 0);
      });

    // Add labels to the bars
    svg
      .selectAll(".text")
      .data(avgData)
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("x", (d) => xScale(d.topic) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.avgSentiment) - 5)
      .attr("text-anchor", "middle")
      .text((d) => d.avgSentiment.toFixed(2));

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Average Sentiment Across Topics");

    // Add x-axis label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 20)
      .style("text-anchor", "middle")
      .text("Topics");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .style("text-anchor", "middle")
      .text("Average Sentiment");
  };

  return <div id="sentiment-bar-chart"></div>;
};

export default SentimentBarChart;
