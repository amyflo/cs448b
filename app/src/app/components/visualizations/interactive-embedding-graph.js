"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const InteractiveEmbeddingGraph = ({ id, axis, points }) => {
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

    const axisColor = "crimson";
    const pointsColor = "black";

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
      .append("line")
      .attr("x1", width / 2)
      .attr("x2", width / 2)
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", axisColor)
      .style("stroke-dasharray", "5,5");

    const axisVector = diff(emb(axis0), emb(axis1));
    const x_val = (d) => dot(axisVector, emb(d));

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(pointsWords, x_val))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([0, pointsWords.length - 1])
      .range([0, height]);

    const y = (i) => yScale(i);

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
      .attr("fill", pointsColor);

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
      .attr("fill", axisColor)
      .attr("text-anchor", (d, i) => (i === 0 ? "start" : "end")) // Align labels
      .style("font-size", "14px");
  };

  return (
    <div>
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
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
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
      <div id={`${id}chart`} style={{ position: "relative" }}></div>
    </div>
  );
};

export default InteractiveEmbeddingGraph;
