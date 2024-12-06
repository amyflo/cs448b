"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const InteractiveEmbeddingGraph = () => {
  // const chartRef = useRef(null);
  // const inputAx0Ref = useRef(null);
  // const inputAx1Ref = useRef(null);
  // const inputPointsRef = useRef(null);

  const [axis0, setAxis0] = useState("i");
  const [axis1, setAxis1] = useState("you");
  const [pointsWords, setPointsWords] = useState([
    "regret",
    "feel",
    "wonder",
    "know",
    "cry",
    "worry",
    "fear",
    "wish"
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const embeddings = await d3.json("/data/embeddings.json");

      //function for retrieving embeddings
      //throw error if word does not exist in corpus
      const emb = (w) => {
        var e = embeddings[w];
        if (e === undefined) {
          throw ReferenceError(w + " does not exist in corpus");
        }
        return e;
      };

      renderChart(emb);
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

  // define chart style
  const axisColor = "crimson";
  const pointsColor = "black;";

  // set up chart area
  const margin = { top: 60, right: 50, bottom: 80, left: 80 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const renderChart = (emb) => {
    // parameters:
    //  emb - function that takes a string and return is corresponding embedding

    const chart = d3.select("#chart")
    

    const svg = chart
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("border", "1px solid black")
      .style("background-color", "white")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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
    

    
    const axisWords = [axis0, axis1];
    const axisVector = diff(emb(axis0), emb(axis1));

    // function for generating x values
    const x_val = (d) => {
      return dot(axisVector, emb(d));
    };
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(axisWords, x_val))
      .range([0, width])
      .clamp(true);

    // define y scale
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

    // draw lines from points to x axis
    svg
      .append("g")
      .attr("id", "linesContainer")
      .selectAll("line")
      .data(pointsWords, (d) => d)
      .join("line")
        .attr("x1", (d) => xScale(x_val(d)))
        .attr("y1", (_, i) => y(i))
        .attr("x2", (d) => xScale(x_val(d)))
        .attr("y2", height / 2)
        .style("stroke", axisColor);

    // plot points
    svg 
      .append("g")
      .attr("id", "pointsContainer")
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

    //TODO: prevent clipping outside of viz bounds

    // TODO: add white background to points

    // label the x-axis' endpoints
    svg.append("g")
      .attr("id", "axisLabelsContainer")
      .selectAll("text")
      .data(axisWords, (d) => d)
      .join("text")
        .attr("class", "axisLabels")
        .attr("x", (d) => xScale(x_val(d)))
        .attr("y", () => height / 2 - 10)
        .attr("fill", axisColor)
        .attr("text-anchor", "middle")
        .text((d) => d)
    
    // bind update function to text inputs
    d3.select("#inputAx0").on("change", (e)=>{
      const newAx0 = e.target.value.toLowerCase().replace(/[^0-9a-z]/gi, '')
      setAxis0(newAx0)
      const axis = [newAx0, axis1]
      update(emb, axis, pointsWords)
    })
    d3.select("#inputAx1").on("change", (e) => {
      const newAx1 = e.target.value.toLowerCase().replace(/[^0-9a-z]/gi, '')
      setAxis1(newAx1)
      const axis = [axis0, newAx1]
      update(emb, axis, pointsWords)
    })
    d3.select("#inputPoints").on("change", (e) => {
      //lowercase input and remove all non-alphanumerics
      const newPoints = e.target.value.toLowerCase().replace(/[^0-9a-z,]/gi, '').split(",")
      setPointsWords(newPoints)
      update(emb, [axis0, axis1], newPoints)
    })
    
  };//end renderChart

  function update(emb, axisWords, pointsWords) {
    const axisVector = diff(emb(axisWords[0]), emb(axisWords[1]));
    // function for generating x values
    const x_val = (d) => {
      return dot(axisVector, emb(d));
    };
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(axisWords, x_val))
      .range([0, width])
      .clamp(true);

    // define y scale
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

    // draw lines from points to x axis
    d3.select("#linesContainer").selectAll("line")
      .data(pointsWords, (d) => d)
      .join("line")
        .transition()
        .duration(1000)
        .attr("x1", (d) => xScale(x_val(d)))
        .attr("y1", (_, i) => y(i))
        .attr("x2", (d) => xScale(x_val(d)))
        .attr("y2", height / 2)
        .style("stroke", axisColor);

    // plot points
    d3.select("#pointsContainer").selectAll("text")
      .data(pointsWords, (d) => d)
      .join("text")
        .transition()
        .duration(1000)
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

    //TODO: prevent clipping outside of viz bounds

    // TODO: add white background to points


    // label the x-axis' endpoints
    d3.select("#axisLabelsContainer").selectAll("text")
      .data(axisWords, (d) => d)
      .join("text")
        .attr("x", (d) => xScale(x_val(d)))
        .attr("y", () => height / 2 - 10)
        .attr("fill", axisColor)
        .attr("text-anchor", "middle")
        .text((d) => d)
  }//end update

  return (
    <div>
      <div>
        Axis: <input id="inputAx0" defaultValue={axis0}/>  to  <input id="inputAx1" defaultValue={axis1}/>
      </div>
      <label>
        Plot these words: <input id="inputPoints" defaultValue={pointsWords}/>
      </label>
      <div id="chart" style={{ position: "relative" }} />      
    </div>
  );
};

export default InteractiveEmbeddingGraph;
