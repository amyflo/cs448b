import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PostFrequencyChart = ({
  showSpecificPoints = false,
  pointA = "",
  pointB = "",
  title = "Post Frequency Over Time",
  editable = false,
}) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        const parsedData = Object.entries(json).map(([postId, post]) => ({
          date: d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(post.createdAt),
        }));

        // Group by month and count posts
        const groupedData = d3.rollups(
          parsedData,
          (values) => values.length,
          (d) => d3.timeMonth.floor(d.date)
        );

        let frequencyData = groupedData.map(([date, count]) => ({
          date,
          frequency: count,
        }));

        // Sort data by date (ascending)
        frequencyData = frequencyData.sort((a, b) => a.date - b.date);

        setData(frequencyData);

        // Extract unique months
        const months = Array.from(
          new Set(frequencyData.map((d) => d3.timeFormat("%Y-%m")(d.date)))
        ).sort();

        setAvailableMonths(months);

        // Filter data by pointA and pointB if provided
        const filteredByRange = frequencyData.filter(
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
    const margin = { top: 60, right: 50, bottom: 80, left: 50 }; // Increased margins for labels and title
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10) // Position above the chart
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(title);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.frequency)])
      .nice()
      .range([height, 0]);

    // Add grid lines
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

    // X Axis
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

    // Y Axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `rotate(-90)`)
      .attr("x", -height / 2)
      .attr("y", -margin.left)
      .attr("fill", "black")
      .style("font-size", "12px")
      .text("Number of posts");

    // Line Animation
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.frequency))
      .curve(d3.curveMonotoneX);

    const path = svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    const totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000) // Adjust duration for smoother animation
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
    // Dots Animation
    svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.frequency))
      .attr("r", 0) // Start with radius 0
      .attr("fill", "steelblue")
      .transition()
      .delay((_, i) => i * 100) // Stagger animation
      .duration(500)
      .attr("r", 4); // Final radius

    // Tooltip Setup
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("display", "block") // Always visible
      .style("pointer-events", "none");
    svg
      .selectAll(".dot")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(
          `<strong>Month:</strong> ${d3.timeFormat("%B %Y")(d.date)}<br/>
           <strong>Number of posts:</strong> ${d.frequency}`
        );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    // Add specific points if enabled
    if (showSpecificPoints) {
      const specificPoints = [
        { date: d3.timeParse("%Y-%m")("2023-01"), label: "Spike in posts" },
        { date: d3.timeParse("%Y-%m")("2023-04"), label: "Peak submissions" },
        { date: d3.timeParse("%Y-%m")("2023-06"), label: "Closed" },
        { date: d3.timeParse("%Y-%m")("2024-11"), label: "Reopened" },
      ];

      specificPoints.forEach((point) => {
        const dataPoint = filteredData.find(
          (d) =>
            d3.timeFormat("%Y-%m")(d.date) ===
            d3.timeFormat("%Y-%m")(point.date)
        );

        if (dataPoint) {
          svg
            .append("circle")
            .attr("cx", xScale(dataPoint.date))
            .attr("cy", yScale(dataPoint.frequency))
            .attr("r", 6)
            .attr("fill", "lightblue")
            .on("mouseover", (event) => {
              tooltip.style("display", "block").html(
                `<strong>${point.label}</strong><br/>
                   <strong>Month:</strong> ${d3.timeFormat("%B %Y")(
                     dataPoint.date
                   )}<br/>
                   <strong>Number of posts:</strong> ${dataPoint.frequency}`
              );
            })
            .on("mousemove", (event) => {
              tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
              tooltip.style("display", "none");
            });

          svg
            .append("text")
            .attr("x", xScale(dataPoint.date) - 10)
            .attr("y", yScale(dataPoint.frequency) - 10)
            .attr("fill", "black")
            .style("font-size", "9px")
            .style("text-anchor", "end")
            .text(point.label);
        }
      });
    }

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [filteredData, showSpecificPoints]);

  return (
    <>
      <svg ref={chartRef} className="w-full h-auto mt-4"></svg>
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
