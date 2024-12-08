"use client";

import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const InteractiveEmbeddingGraph = ({
  id,
  axis,
  title = "TODO",
  points,
  axisEditable = true,
  pointsEditable = true,
}) => {
  const [axis0, setAxis0] = useState(axis[0]);
  const [axis1, setAxis1] = useState(axis[1]);
  const [pointsWords, setPointsWords] = useState(points);
  const [errors, setErrors] = useState(new Set());
  const [input, setInput] = useState(pointsWords.join(", "));

  useEffect(() => {
    const fetchData = async () => {
      const embeddings = await d3.json("/data/embeddings.json");

      // Function to retrieve embeddings and handle errors
      const emb = (w) => {
        const sanitizedWord = w.toLowerCase().replace(/[^0-9a-z]/gi, "");
        const e = embeddings[sanitizedWord];
        if (!e) {
          setErrors((prevState) => new Set(prevState.add(w)));
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

    const margin = { top: 80, right: 50, bottom: 80, left: 80 }; // Increased top margin for more space
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const axisColor = "black";

    const svg = chart
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add title with adjusted spacing
    svg
      .append("text")
      .attr("x", width / 2) // Center horizontally
      .attr("y", -margin.top / 2) // Add space between the title and chart content
      .attr("text-anchor", "middle") // Center the text
      .style("font-size", "18px") // Larger font size for emphasis
      .style("font-weight", "bold") // Bold text for visibility
      .text(title);

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

    // calulate value of axis vector, then normalize to unit length
    var ax = diff(emb(axis0), emb(axis1));
    const lenAx = Math.sqrt(ax[0] ** 2 + ax[1] ** 2);
    const axisVector = ax.map((n) => n / lenAx);

    const x_val = (d) => dot(axisVector, emb(d));

    const axisWords = [axis0, axis1];
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(axisWords, x_val))
      .range([0, width - 10])
      .clamp(true);

    const colorScale = d3
      .scaleLinear()
      .domain(d3.extent(axisWords, x_val))
      .range(["blue", "red"]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(pointsWords, x_val))
      .domain([0, pointsWords.length - 1])
      .range([0, height - 50]);

    // y function ensures words don't get plotted on top of the x axis
    const y = (i) => {
      if (i >= pointsWords.length / 2 - 1) {
        return yScale(i + 1);
      }
      return yScale(i);
    };

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

    // sort words to ensure no words overlap lines
    var sortedPointsWords = pointsWords.filter(function (d) {
      return emb(d) != null;
    });
    sortedPointsWords = d3.sort(
      Array.from(
        d3.group(sortedPointsWords, x_val).values(),
        (group) => group[0]
      ),
      (d) => x_val(d)
    ); // sort and remove duplicates
    sortedPointsWords = sortedPointsWords
      .slice(0, sortedPointsWords.length / 2 - 1)
      .concat(
        sortedPointsWords.slice(sortedPointsWords.length / 2 - 1).reverse()
      );

      const normalizedDist = (w1, w2) => {
        return Math.abs(xScale(x_val(w1)) - xScale(x_val(w2))) / (xScale(x_val(axis0)) - xScale(x_val(axis1)));
      }

    // Draw points
    svg
      .append("g")
      .selectAll("text")
      .data(sortedPointsWords)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(x_val(d)))
      .attr("dx", 5)
      .attr("y", (_, i) => y(i))
      .attr("dy", 3)
      .text((d) => d)
      .attr("fill", (d) => colorScale(x_val(d)))
      .on("mouseover", (event, d) => {
        // Show the tooltip with word details
        const distanceToAxis0 = normalizedDist(d, axis0)
        const distanceToAxis1 = normalizedDist(d, axis1)
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

    // Draw lines from points to axes
    svg
      .append("g")
      .selectAll("line")
      .data(sortedPointsWords)
      .enter()
      .append("line")
      .attr("x1", (d) => xScale(x_val(d)))
      .attr("y1", (_, i) => y(i))
      .attr("x2", (d) => xScale(x_val(d)))
      .attr("y2", height / 2)
      .attr("stroke", (d) => colorScale(x_val(d)))
      .attr("stroke-dotted", "2 5 10 5")
      .attr("opacity", 0.5);

    // draw a dot on the axis, too
    svg
      .append("g")
      .selectAll("circle")
      .data(sortedPointsWords)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(x_val(d))) // Same x-coordinate as the lines
      .attr("cy", height / 2) // Positioned on the axis
      .attr("r", 1) // Dot radius
      .attr("fill", (d) => colorScale(x_val(d))) // Use the same color scale
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    // Label axes
    svg
      .append("g")
      .selectAll(".axis-label")
      .data(axisWords)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(x_val(d))) // Position at start and end of x-axis
      .attr("dx", (d, i) => (i === 0 ? 5 : -5))
      .attr("y", height / 2 - 10)
      .text((d) => d)
      .attr("fill", (d) => colorScale(x_val(d)))
      .attr("text-anchor", (d, i) => (i === 0 ? "start" : "end")) // Align labels
      .style("font-size", "14px")
      .style("font-weight", "bold");
  };

  return (
    <div className="flex flex-col gap-2">
      <div id={`${id}chart`}></div>
      {axisEditable && (
        <div className="flex flex-row items-center gap-4 w-full p-2 border rounded-lg shadow-sm bg-gray-50">
          <label
            htmlFor={`${id}inputAx0`}
            className="text-sm font-semibold text-gray-700"
          >
            Customize your axes labels (e.g., love to hate):
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              type="text"
              id={`${id}inputAx0`}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm shadow-sm"
              defaultValue={axis0}
              onBlur={(e) => {
                setAxis1(e.target.value);
              }}
              onChange={(e) => {
                setAxis1(e.target.value);
                setErrors(new Set());
              }}
              placeholder="Axis 0"
            />
            <span className="text-sm font-semibold text-gray-600">to</span>
            <input
              type="text"
              id={`${id}inputAx1`}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm shadow-sm"
              defaultValue={axis1}
              onBlur={(e) => {
                setAxis0(e.target.value);
              }}
              onChange={(e) => {
                setAxis0(e.target.value);
                setErrors(new Set());
              }}
              placeholder="Axis 1"
            />
          </div>
        </div>
      )}
      <div className="flex flex-row w-full gap-4">
        {pointsEditable && (
          <div className="flex flex-row items-center gap-4 w-full p-2 border rounded-lg shadow-sm bg-gray-50">
            <label
              htmlFor={`${id}inputPoints`}
              className="text-sm font-semibold text-gray-700"
            >
              Words Plotted:
            </label>
            <input
              type="text"
              id={`${id}inputPoints`}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm shadow-sm"
              onBlur={(e) => {
                setPointsWords(e.target.value.split(",").map((w) => w.trim()));
                setErrors(new Set());
              }}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setErrors(new Set());
              }}
            />
          </div>
        )}
        <button
          className=""
          onClick={() => {
            setAxis0(axis[0]);
            setAxis1(axis[1]);
            setPointsWords(points);
            setErrors(new Set());
            setInput(points.join(", "));
          }}
        >
          Reset
        </button>
      </div>
      {errors.size > 0 && (
        <div style={{ marginBottom: "10px", color: "red" }}>
          {Array.from(errors).join()} cannot be found in r/LoveLetters.
        </div>
      )}
    </div>
  );
};

export default InteractiveEmbeddingGraph;
