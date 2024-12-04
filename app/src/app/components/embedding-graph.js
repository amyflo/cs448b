"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const EmbeddingGraph = ({ axis, points }) => {
  const chartRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const embeddings = await d3.json("/data/embeddings.json");
        console.log(embeddings);

        //function for retrieving embeddings
        //throw error if word does not exist in corpus
        const emb = (w) => {
          var e = embeddings[w];
          if (e === undefined) {
            console.log(embeddings);
            throw ReferenceError(w + " does not exist in corpus");
          }
          return e;
        };

        renderChart(emb, axis, points);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //////////////////////
  // helper functions //
  //////////////////////

  // function for dot product of two vectors
  const dot = (v1, v2) => {
    var sum = 0;
    for (var i = 0; i < v1.length; i++) {
      sum += v1[i] * v2[i];
    }
    return sum;
  };

  // function for substracting two vectors.
  // performs v1 - v2
  const diff = (v1, v2) => {
    var new_v = Array(v1.length);
    for (var i = 0; i < v1.length; i++) {
      new_v[i] = v1[i] - v2[i];
    }
    return new_v;
  };

  ////////////////////
  // chart creation //
  ////////////////////

  const renderChart = (emb, axisWords, pointsWords) => {
    // parameters:
    //  emb - function that takes a string and return is corresponding embedding
    //  axisWords - array of 2 strings. These define the line along which other words will be plotted
    //  pointsWords - words to plot on the line defined by axisWords

    // define chart style
    const axisColor = "crimson";
    const pointsColor = "black;";

    // set up chart area
    const margin = { top: 60, right: 50, bottom: 80, left: 80 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const chart = d3.select(chartRef.current);
    const svg = chart
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("border", "1px solid black")
      .style("background-color", "white")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // function for generating x values
    const v_axis = diff(emb(axisWords[0]), emb(axisWords[1]));
    const x_val = (d) => {
      return dot(v_axis, emb(d));
    };

    // define x and y scale
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(axisWords, x_val))
      .range([0, width]);

    const yScale = d3.scaleLinear().domain([0, pointsWords.length]).range([0, height]);
    // skip plotting word in the center of the graph 
    // ensures words aren't drawn on top of the x axis
    const y = (i) => {
      if (i > (pointsWords.length - 1) / 2) {
        return yScale(i + 1)
      } else {
        return yScale(i)
      }
    }

    // draw axes
    svg
      .append("line") // create horizontal line in the middle of the chart
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", height / 2)
      .attr("y2", height / 2)
      .style("stroke", axisColor);

    svg
      .append("line") // create vertical line in the middle of the chart
      .attr("x1", width / 2)
      .attr("x2", width / 2)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke-dasharray", "5,5") // dotted
      .style("stroke", axisColor);

    
    // draw lines from points to x axis
    svg
      .append("g")
      .attr("id", "pointsContainer")
      .selectAll("line")
      .data(pointsWords, d => d)
      .join("line")
        .attr("x1", (d) => xScale(x_val(d)))
        .attr("y1", (_, i) => y(i))
        .attr("x2", (d) => xScale(x_val(d)))
        .attr("y2", height/2)
        .style("stroke", axisColor);

    // plot points
    svg
      .select("#pointsContainer")
      .selectAll("text")
      .data(pointsWords, (d) => d)
      .join("text")
        .attr("class", "points")
        .attr("x", (d) => xScale(x_val(d)))
        .attr("y", (_, i) => y(i))
        .attr("dy", (_, i) => {
          if (y(i) > height / 2) {
            return 10
          }
          else {
            return -5
          }
        })
        .attr("dx", 5)
        .attr("fill", pointsColor)
        .text((d) => d);

        // TODO: add white background to points


    svg // label the x-axis' endpoints
      .selectAll("text")
      .data(axisWords, (d) => d)
      .join(
        (enter) =>
          enter
            .append("text")
            .attr("x", (d) => xScale(x_val(d)))
            .attr("y", () => height / 2 - 10)
            .attr("fill", axisColor)
            .attr("text-anchor", "middle")
            .text((d) => d),
        (update) => update,
        (exit) => exit
      );
  };

  return <div ref={chartRef} style={{ position: "relative" }}></div>;
};

export default EmbeddingGraph;
