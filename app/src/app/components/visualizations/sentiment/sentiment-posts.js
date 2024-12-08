import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SentimentBarChartHorizontal = () => {
  const chartRef = useRef();
  const [data, setData] = useState([]);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        // Process data into categories by sentiment
        const processedData = Object.entries(json).map(([postId, post]) => ({
          postId,
          title: post.title,
          bodyScore: post.bodySentiment.score,
        }));

        setData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the chart is visible
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, []);

  const renderChart = (data) => {
    const svgWidth = 800;
    const svgHeight = 450; // Increased height to accommodate the title and labels
    const margin = { top: 70, right: 50, bottom: 70, left: 120 }; // Adjusted margins for axis labels
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    svg.selectAll("*").remove(); // Clear previous content

    // Add title
    svg
      .append("text")
      .attr("x", svgWidth / 2)
      .attr("y", margin.top / 3)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-weight", "bold")
      .text("Sentiment Analysis of Posts in r/LoveLetters");

    // Aggregate data into sentiment categories
    const sentimentCounts = {
      negative: data.filter((d) => d.bodyScore < 0).length,
      neutral: data.filter((d) => d.bodyScore === 0).length,
      positive: data.filter((d) => d.bodyScore > 0).length,
    };

    const chartData = [
      { category: "negative", count: sentimentCounts.negative },
      { category: "neutral", count: sentimentCounts.neutral },
      { category: "positive", count: sentimentCounts.positive },
    ];

    const yScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.category))
      .range([0, chartHeight])
      .padding(0.2);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.count)])
      .range([0, chartWidth]);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Y-Axis
    chartGroup.append("g").call(d3.axisLeft(yScale));

    // Add Y-Axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -svgHeight / 2)
      .attr("y", margin.left / 3)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Sentiment Category");

    // X-Axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));

    // Add X-Axis label
    svg
      .append("text")
      .attr("x", margin.left + chartWidth / 2)
      .attr("y", svgHeight - margin.bottom / 3)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Number of Posts");

    // Bars with animation
    const bars = chartGroup
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.category))
      .attr("x", 0)
      .attr("width", 0) // Start width at 0 for animation
      .attr("height", yScale.bandwidth())
      .attr("fill", (d) =>
        d.category === "negative"
          ? "blue"
          : d.category === "neutral"
          ? "gray"
          : "red"
      );

    // Labels on bars
    const labels = chartGroup
      .selectAll(".label")
      .data(chartData)
      .enter()
      .append("text")
      .attr("x", 0) // Start labels at 0 for animation
      .attr("y", (d) => yScale(d.category) + yScale.bandwidth() / 2)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "middle")
      .attr("fill", "#333")
      .style("font-size", "12px");

    // Trigger animation when in view
    bars
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("width", (d) => xScale(d.count));

    labels
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("x", (d) => xScale(d.count) + 5)
      .text((d) => d.count);
  };
  useEffect(() => {
    if (isInView && data.length) {
      renderChart(data);
    }
  }, [isInView, data]);

  return <svg ref={chartRef}></svg>;
};

export default SentimentBarChartHorizontal;
