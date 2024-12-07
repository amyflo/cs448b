import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SentimentBoxChart = () => {
  const chartRef = useRef();
  const [data, setData] = useState([]);
  const [sortMethod, setSortMethod] = useState("bodyScore"); // Default sorting by bodyScore

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Process the data
        const processedData = Object.entries(json).map(([postId, post]) => ({
          postId,
          title: post.title,
          titleScore: post.titleSentiment.score,
          bodyScore: post.bodySentiment.score,
          averageCommentScore: post.averageCommentScore,
          createdAt: new Date(post.createdAt), // Parse date for sorting
        }));

        setData(processedData);
        renderChart(processedData, "bodyScore"); // Initial render
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (data, sortKey) => {
    const width = 1000;
    const boxSize = 20;
    const padding = 5;
    const sectionPadding = 50;

    const colorScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.bodyScore),
        0,
        d3.max(data, (d) => d.bodyScore),
      ])
      .range(["blue", "white", "red"]);

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", 600)
      .style("position", "relative");

    svg.selectAll("*").remove(); // Clear previous elements

    const tooltipEl = d3.select(chartRef.current.parentNode).select(".tooltip");

    // Ensure tooltip exists
    if (tooltipEl.empty()) {
      d3.select(chartRef.current.parentNode)
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("box-shadow", "0px 4px 8px rgba(0,0,0,0.3)")
        .style("visibility", "hidden")
        .style("font-size", "12px");
    }

    // Sort data based on sortKey
    const sortedData = [...data].sort((a, b) =>
      sortKey === "createdAt"
        ? d3.ascending(a.createdAt, b.createdAt)
        : d3.ascending(a.bodyScore, b.bodyScore)
    );

    // Separate data by categories
    const categories = {
      negative: sortedData.filter((d) => d.bodyScore < 0),
      neutral: sortedData.filter((d) => d.bodyScore === 0),
      positive: sortedData.filter((d) => d.bodyScore > 0),
    };

    const categoryLabels = {
      negative: "Negative",
      neutral: "Neutral",
      positive: "Positive",
    };

    let currentYOffset = 0;

    Object.entries(categories).forEach(([category, categoryData]) => {
      // Add category label
      svg
        .append("text")
        .attr("x", 10)
        .attr("y", currentYOffset + 20)
        .attr("font-size", "16px")
        .attr("fill", "#333")
        .text(`${categoryLabels[category]} (${categoryData.length})`);

      // Add boxes for the category
      const numPerRow = Math.floor(width / (boxSize + padding));

      svg
        .selectAll(`.rect-${category}`)
        .data(categoryData)
        .enter()
        .append("rect")
        .attr("class", `rect-${category}`)
        .attr("x", (_, i) => (i % numPerRow) * (boxSize + padding))
        .attr(
          "y",
          (_, i) =>
            Math.floor(i / numPerRow) * (boxSize + padding) +
            currentYOffset +
            30
        )
        .attr("width", boxSize)
        .attr("height", boxSize)
        .attr("fill", (d) => colorScale(d.bodyScore))
        .attr("stroke", "#ccc")
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
          tooltipEl.style("visibility", "visible").html(
            `<strong>Post ID:</strong> ${d.postId}<br>
              <strong>Title:</strong> ${d.title}<br>
              <strong>Date:</strong> ${d.createdAt.toDateString()}<br>
              <strong>Body Score:</strong> ${d.bodyScore.toFixed(2)}<br>
              <strong>Title Score:</strong> ${d.titleScore.toFixed(2)}<br>
              <strong>Avg. Comment Score:</strong> ${d.averageCommentScore.toFixed(
                2
              )}`
          );
        })
        .on("mousemove", (event) => {
          tooltipEl
            .style("left", `${event.pageX}px`)
            .style("top", `${event.pageY}px`);
        })
        .on("mouseout", () => {
          tooltipEl.style("visibility", "hidden");
        });

      // Adjust Y offset for the next category
      const numRows = Math.ceil(categoryData.length / numPerRow);
      currentYOffset += numRows * (boxSize + padding) + sectionPadding;
    });

    // Adjust overall height based on the content
    svg.attr("height", currentYOffset);
  };

  // Handle sorting change
  const handleSortChange = (sortKey) => {
    setSortMethod(sortKey);
    renderChart(data, sortKey); // Re-render with the new sorting method
  };

  return (
    <div>
      <svg ref={chartRef} />
    </div>
  );
};

export default SentimentBoxChart;
