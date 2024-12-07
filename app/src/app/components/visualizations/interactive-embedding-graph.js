"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const InteractiveEmbeddingGraph = ({
  id,
  axis,
  points,
  axisEditable = true,
  pointsEditable = true,
}) => {
  const [axis0, setAxis0] = useState(axis[0]);
  const [axis1, setAxis1] = useState(axis[1]);
  const [pointsWords, setPointsWords] = useState(points);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const embeddings = await d3.json("/data/embeddings.json");

      // Function to retrieve embeddings and handle errors
      const emb = (w) => {
        const sanitizedWord = w.toLowerCase().replace(/[^0-9a-z]/gi, "");
        const e = embeddings[sanitizedWord];
        if (!e) {
          return null;
        }
        return e;
      };
      renderChart(emb);
    };

    fetchData();
  }, [axis0, axis1, pointsWords]);

  //////////////////////
  // Helper Functions //
  //////////////////////

  const dot = (v1, v2) => {
    if (!Array.isArray(v1) || !Array.isArray(v2) || v1.length !== v2.length) {
      return 0; // Default value for invalid inputs
    }
    return v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  };

  const diff = (v1, v2) => {
    if (!Array.isArray(v1) || !Array.isArray(v2) || v1.length !== v2.length) {
      return []; // Default value for invalid inputs
    }
    return v1.map((val, i) => val - v2[i]);
  };

  ////////////////////
  // Chart Creation //
  ////////////////////

  const renderChart = (emb) => {
    if (!emb) {
      return;
    }
    const chart = d3.select(`#${id}chart`);
    chart.selectAll("*").remove(); // Clear previous content

    const margin = { top: 60, right: 50, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const axisColor = "black";

    const svg = chart
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Draw axes
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .style("stroke", axisColor);

    svg
      .append("circle")
      .attr("cx", width / 2) // Center horizontally
      .attr("cy", height / 2) // Center vertically
      .attr("r", 5) // Radius of the dot
      .attr("fill", axisColor); // Use the same color as the axes

    const axisVector = diff(emb(axis0), emb(axis1));
    const x_val = (d) => dot(axisVector, emb(d));

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(pointsWords, x_val))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(pointsWords, x_val))
      .domain([0, pointsWords.length - 1])
      .range([0, height]);

    const y = (i) => yScale(i);

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("opacity", 0) // Initially hidden
      .style("pointer-events", "none");

    // Draw points
    svg
      .append("g")
      .selectAll("text")
      .data(pointsWords)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(x_val(d)))
      .attr("y", (_, i) => y(i))
      .text((d) => d)
      .attr("fill", "black")
      .on("mouseover", (event, d) => {
        // Show the tooltip with word details
        const distanceToAxis0 = Math.abs(x_val(d) - xScale.range()[1]);
        const distanceToAxis1 = Math.abs(x_val(d) - xScale.range()[0]);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Word:</strong> ${d}<br/>
             <strong>Distance to ${axis0}:</strong> ${distanceToAxis0.toFixed(
              2
            )}<br/>
             <strong>Distance to ${axis1}:</strong> ${distanceToAxis1.toFixed(
              2
            )}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mousemove", (event) => {
        // Move the tooltip with the mouse
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseout", () => {
        // Hide the tooltip
        tooltip.style("opacity", 0);
      });

    // Label axes
    const axisWords = [axis0, axis1];
    svg
      .append("g")
      .selectAll(".axis-label")
      .data(axisWords)
      .enter()
      .append("text")
      .attr("x", (d, i) => (i === 0 ? 0 : width)) // Position at start and end of x-axis
      .attr("y", height / 2 - 10)
      .text((d) => d)
      .attr("fill", (d, i) => (i === 0 ? "blue" : "red"))
      .attr("text-anchor", (d, i) => (i === 0 ? "start" : "end")) // Align labels
      .style("font-size", "14px");
  };

  return (
    <div>
      {axisEditable && (
        <div>
          Axis:{" "}
          <input
            id={`${id}inputAx0`}
            defaultValue={axis0}
            onBlur={(e) => setAxis0(e.target.value)}
          />{" "}
          to{" "}
          <input
            id={`${id}inputAx1`}
            defaultValue={axis1}
            onBlur={(e) => setAxis1(e.target.value)}
          />
        </div>
      )}
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      {pointsEditable && (
        <label>
          Plot these words:{" "}
          <input
            className="w-full"
            id={`${id}inputPoints`}
            defaultValue={pointsWords.join(", ")}
            onBlur={(e) =>
              setPointsWords(e.target.value.split(",").map((w) => w.trim()))
            }
          />
        </label>
      )}
      <button
        onClick={() => {
          setAxis0(axis[0]);
          setAxis1(axis[1]);
          setPointsWords(points);
        }}
      >
        Reset
      </button>
      <div id={`${id}chart`} style={{ position: "relative" }}></div>
    </div>
  );
};

export default InteractiveEmbeddingGraph;
