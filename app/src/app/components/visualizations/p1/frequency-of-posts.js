"use client";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const PostFrequencyChart = ({
  uniqueId = "chart",
  showSpecificPoints = false,
  pointA = "",
  pointB = "",
  title = "Post Frequency Over Time",
  editable = false,
}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        const parsedData = Object.entries(json).map(([, post]) => ({
          date: d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(post.createdAt),
        }));

        const groupedData = d3.rollups(
          parsedData,
          (values) => values.length,
          (d) => d3.timeMonth.floor(d.date)
        );

        let totalPostsData = groupedData
          .map(([date, count]) => ({ date, totalPosts: count }))
          .sort((a, b) => a.date - b.date);

        let accumulatedTotal = 0;
        totalPostsData = totalPostsData.map((d) => {
          accumulatedTotal += d.totalPosts;
          return { ...d, accumulatedTotal };
        });

        setData(totalPostsData);

        const months = Array.from(
          new Set(totalPostsData.map((d) => d3.timeFormat("%Y-%m")(d.date)))
        ).sort();

        setAvailableMonths(months);

        const filteredByRange = totalPostsData.filter(
          (d) =>
            (!pointA || d.date >= d3.timeParse("%Y-%m")(pointA)) &&
            (!pointB || d.date <= d3.timeParse("%Y-%m")(pointB))
        );

        setFilteredData(filteredByRange);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [pointA, pointB]);

  useEffect(() => {
    if (filteredData.length) {
      const margin = { top: 60, right: 10, bottom: 80, left: 50 };
      const width = 1000 - margin.left - margin.right;
      const height = 600 - margin.top - margin.bottom;

      d3.select(`#${uniqueId}`).selectAll("*").remove();

      const svg = d3
        .select(`#${uniqueId}`)
        .attr(
          "viewBox",
          `0 0 ${width + margin.left + margin.right} ${
            height + margin.top + margin.bottom
          }`
        )
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Tooltip container
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

      function showTooltip(tooltip, event, d) {
        tooltip
          .html(
            `
              <strong>Month:</strong> ${d3.timeFormat("%B %Y")(d.date)}<br/>
              <strong>Number of posts:</strong> ${d.totalPosts}<br/>
              <strong>Total posts so far:</strong> ${d.accumulatedTotal}
            `
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`)
          .transition()
          .duration(200)
          .style("opacity", 1);
      }

      function hideTooltip(tooltip) {
        tooltip.transition().duration(200).style("opacity", 0);
      }

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(title);

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(filteredData, (d) => d.date))
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(filteredData, (d) => d.accumulatedTotal)])
        .nice()
        .range([height, 0]);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(
          d3
            .axisBottom(xScale)
            .ticks(d3.timeMonth.every(2))
            .tickFormat(d3.timeFormat("%b %Y"))
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .attr("fill", "black")
        .style("font-size", "12px")
        .text("Month");

      svg.append("g").call(d3.axisLeft(yScale));

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `rotate(-90)`)
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .attr("fill", "black")
        .style("font-size", "12px")
        .text("Total number of posts");

      svg
        .append("g")
        .attr("class", "grid grid-y")
        .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "2,2");

      svg
        .append("g")
        .attr("class", "grid grid-x")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "2,2");
      svg
        .append("path")
        .datum(filteredData)
        .attr("fill", "none")
        .attr("stroke", "pink")
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.accumulatedTotal))
            .curve(d3.curveMonotoneX)
        );

      const specificPoints = [
        { date: "2023-01", label: "Spike in posts" },
        { date: "2023-04", label: "Peak submissions" },
        { date: "2023-06", label: "Closed" },
        { date: "2024-11", label: "Reopened" },
      ];

      specificPoints.forEach((point) => {
        if (showSpecificPoints) {
          // Find the matching data point
          const dataPoint = filteredData.find(
            (d) => d3.timeFormat("%Y-%m")(d.date) === point.date
          );

          // Check if the dataPoint exists before proceeding
          if (dataPoint) {
            svg
              .append("text")
              .attr("x", xScale(dataPoint.date) - 10)
              .attr("y", yScale(dataPoint.accumulatedTotal) - 10)
              .attr("fill", "black")
              .style("font-size", "9px")
              .style("text-anchor", "end")
              .text(point.label);
          } else {
            console.warn(
              `No matching data point found for specific point: ${point.date}`
            );
          }
        }
      });

      svg
        .selectAll(".dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.accumulatedTotal))
        .attr("r", (d) => {
          // Check if this point matches a specific point
          const isSpecificPoint =
            showSpecificPoints &&
            specificPoints.some(
              (point) => d3.timeFormat("%Y-%m")(d.date) === point.date
            );
          return isSpecificPoint ? 6 : 4; // Larger radius for specific points
        })
        .attr("fill", (d) => {
          // Assign a different color for specific points
          const isSpecificPoint =
            showSpecificPoints &&
            specificPoints.some(
              (point) => d3.timeFormat("%Y-%m")(d.date) === point.date
            );
          return isSpecificPoint ? "red" : "pink";
        })
        .style("cursor", "pointer") // Pointer cursor for hover effect
        .on("mouseover", (event, d) => {
          const matchedPoint = specificPoints.find(
            (point) => d3.timeFormat("%Y-%m")(d.date) === point.date
          );
          const tooltipData = matchedPoint
            ? { ...d, label: matchedPoint.label }
            : d;
          showTooltip(tooltip, event, tooltipData); // Pass label if it exists
        })
        .on("mouseout", () => {
          hideTooltip(tooltip);
        });
    }
  }, [filteredData, uniqueId]);

  return (
    <>
      <svg id={uniqueId} className="w-full h-auto mt-4"></svg>
      {editable && (
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-md">
          <label className="flex flex-col text-sm font-medium text-gray-700">
            Start month:
            <select
              onChange={(e) =>
                setFilteredData(
                  data.filter(
                    (d) =>
                      d.date >= d3.timeParse("%Y-%m")(e.target.value) &&
                      (!pointB || d.date <= d3.timeParse("%Y-%m")(pointB))
                  )
                )
              }
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select Start Month</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {d3.timeFormat("%B %Y")(d3.timeParse("%Y-%m")(month))}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-gray-700">
            End month:
            <select
              onChange={(e) =>
                setFilteredData(
                  data.filter(
                    (d) =>
                      (!pointA || d.date >= d3.timeParse("%Y-%m")(pointA)) &&
                      d.date <= d3.timeParse("%Y-%m")(e.target.value)
                  )
                )
              }
              className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select End Month</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {d3.timeFormat("%B %Y")(d3.timeParse("%Y-%m")(month))}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => setFilteredData(data)} // Reset to original data
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
          >
            Reset
          </button>
        </div>
      )}
    </>
  );
};

export default PostFrequencyChart;
