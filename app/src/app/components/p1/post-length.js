import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PostLengthChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ start: null, end: null });
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/consolidated_posts.json");
        const json = await response.json();

        const parsedData = Object.entries(json).map(([postId, post]) => ({
          date: d3.timeParse("%Y-%m-%dT%H:%M:%S.%LZ")(post.createdAt),
          wordCount: post.body
            ? post.body.split(/\s+/).filter((word) => word.trim().length > 0)
                .length
            : 0, // Calculate number of words
        }));

        // Group by month and calculate average word count
        const groupedData = d3.rollups(
          parsedData,
          (values) => d3.mean(values, (d) => d.wordCount), // Average word count
          (d) => d3.timeMonth.floor(d.date)
        );

        const avgLengthData = groupedData.map(([date, avgLength]) => ({
          date,
          avgLength,
        }));

        setData(avgLengthData);
        setFilteredData(avgLengthData);

        // Extract unique months and years
        const months = Array.from(
          new Set(avgLengthData.map((d) => d3.timeFormat("%Y-%m")(d.date)))
        ).sort();

        setAvailableMonths(months);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!filteredData.length) return;

    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

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

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(filteredData, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.avgLength)])
      .nice()
      .range([height, 0]);

    // Gridlines
    const gridlinesX = d3.axisBottom(xScale).tickSize(-height).tickFormat("");
    const gridlinesY = d3.axisLeft(yScale).tickSize(-width).tickFormat("");

    svg
      .append("g")
      .attr("class", "grid grid-x")
      .attr("transform", `translate(0, ${height})`)
      .call(gridlinesX)
      .selectAll("line")
      .attr("stroke", "#ddd")
      .attr("stroke-dasharray", "2,2");

    svg
      .append("g")
      .attr("class", "grid grid-y")
      .call(gridlinesY)
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
      .attr("y", -margin.left + 15)
      .attr("fill", "black")
      .style("font-size", "12px")
      .text("Average word count");

    // Draw line
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.avgLength))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Tooltip setup
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "sentiment-tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("font-size", "12px")
      .style("display", "none")
      .style("pointer-events", "none")
      .style("z-index", "10");

    // Add dots
    svg
      .selectAll(".dot")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.avgLength))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block").html(
          `<strong>Month:</strong> ${d3.timeFormat("%B %Y")(d.date)}<br/>
           <strong>Average Post Length:</strong> ${d.avgLength.toFixed(2)}<br/>`
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

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [filteredData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value ? d3.timeParse("%Y-%m")(value) : null,
    }));
  };

  const resetFilters = () => {
    setFilter({ start: null, end: null });
    setFilteredData(data);
  };

  useEffect(() => {
    if (filter.start || filter.end) {
      const filtered = data.filter(
        (d) =>
          (!filter.start || d.date >= filter.start) &&
          (!filter.end || d.date <= filter.end)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [filter, data]);

  return (
    <>
      <div>
        <label>
          Start Month:
          <select
            name="start"
            onChange={handleFilterChange}
            value={filter.start ? d3.timeFormat("%Y-%m")(filter.start) : ""}
          >
            <option value="">Select Start Month</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {d3.timeFormat("%B %Y")(d3.timeParse("%Y-%m")(month))}
              </option>
            ))}
          </select>
        </label>
        <label>
          End Month:
          <select
            name="end"
            onChange={handleFilterChange}
            value={filter.end ? d3.timeFormat("%Y-%m")(filter.end) : ""}
          >
            <option value="">Select End Month</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {d3.timeFormat("%B %Y")(d3.timeParse("%Y-%m")(month))}
              </option>
            ))}
          </select>
        </label>
        <button onClick={resetFilters}>Reset</button>
      </div>
      <svg
        ref={chartRef}
        style={{
          width: "100%",
          height: "auto",
        }}
      ></svg>
    </>
  );
};

export default PostLengthChart;
