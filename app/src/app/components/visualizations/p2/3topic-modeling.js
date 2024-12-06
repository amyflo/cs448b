"use client";
import React, { useEffect } from "react";
import * as d3 from "d3";
import "./topic-styling.css";

const TSNEVisualization = ({
  activeTopics = new Set(),
  defaultDetailsPanelHTML = "<p>Click on a point to see more details here.</p>",
  dataFiles = {
    assignedTopics: "/data/topic-modeling/results/top_topics_with_weights.json",
    topicsRef: "/data/topic-modeling/results/topics_NMF_15.json",
    tsneReducedData: "/data/topic-modeling/results/tsne-reduced-data.json",
    lettersData: "/data/consolidated_posts.json",
  },
}) => {
  console.log("prop active topics: ", activeTopics);

  useEffect(() => {
    updatePointOpacities();
  }, [activeTopics]);

  let activeTopicsLocal = new Set(activeTopics);
  console.log("local copy active topics: ", activeTopicsLocal);

  // function for updating the opacity of points of active/selected topic filters
  function updatePointOpacities() {
    console.log("update called");
    d3.selectAll("circle").style("opacity", function () {
      const topic = +d3.select(this).attr("data-topic");
      // console.log("active topics size: ", activeTopicsLocal.size);
      // console.log("active topics: ", activeTopicsLocal);
      // console.log(`has topic ${topic}: ${activeTopicsLocal.has(topic)}`);
      return activeTopicsLocal.size === 0 || activeTopicsLocal.has(topic)
        ? 0.6
        : 0.025;
    });
  }

  // function for keeping track of filter selections
  function toggleTopicOpacity(topicIndex, legendItem) {
    // Deactivate topic
    if (activeTopicsLocal.has(topicIndex)) {
      activeTopicsLocal.delete(topicIndex);
      legendItem.classed("selected", false);
      console.log("active topics: ", activeTopicsLocal);
    } else {
      // Activate topic
      activeTopicsLocal.add(topicIndex);
      legendItem.classed("selected", true);
      console.log("active topics: ", activeTopicsLocal);
    }
    updatePointOpacities();
  }

  // Load the topic assignments, topic reference file, TSNE reduced data, and consolidated posts info
  Promise.all([
    d3.json(dataFiles.assignedTopics),
    d3.json(dataFiles.topicsRef),
    d3.json(dataFiles.tsneReducedData),
    d3.json(dataFiles.lettersData),
  ]).then(([assignedTopicsData, topicsRefData, reducedData, lettersData]) => {
    // Set the canvas and chart dimensions
    const width = 800;
    const height = 700;
    const margin = 40;
    const chartLeftMargin = 200;
    const chartContainerW = 1020;
    const chartContainerH = 750;

    // define the color theme (15 colors for 15 topics)
    const colors = [
      "#e6194B",
      "#f58231",
      "#FFDB58",
      "#bfef45",
      "#3cb44b",
      "#4363d8",
      "#42d4f4",
      "#911eb4",
      "#f032e6",
      "#808000",
      "#8a9edb",
      "#9A6324",
      "#000075",
      "#a9a9a9",
      "#ffd8b1",
    ];

    // Define scales for the x and y axes so it fits within the canvas
    // matches the raw data coordinates (tsne first and second components) to pixels in svg
    // also used for cluster distribution and zooming on selection
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(reducedData, (d) => d.x),
        d3.max(reducedData, (d) => d.x),
      ])
      .range([margin, width]);
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(reducedData, (d) => d.y),
        d3.max(reducedData, (d) => d.y),
      ])
      .range([height, 20]);

    // define zooming transformation (used in on click event for points)
    const zoom = d3
      .zoom()
      .scaleExtent([1, 2]) // Set zoom limits (don't want to zoom in too far)
      .on("zoom", function (event) {
        chartSVG.attr("transform", event.transform);
      });

    // Select the SVG element chart and tooltip (these are the things that should be loading the plots)
    const chartSVG = d3.select("#chart");
    const tooltip = d3.select("#tooltip");

    // detail panel instructions for on-click
    const clickInMsg =
      "<p><i>Click on a point to see more details about the love letter.</i></p>";
    const clickOutMsg =
      "<p><i>Explore another point or click anywhere outside the point to unselect.</i></p>";
    const topicExplanationHeader =
      "<h4>Key Takeaways about Selected Topics: </h4>";

    // point selection variables
    let selectedPt = null; // no point is selected initially
    let zoomScale = 1;
    for (let i = 0; i < reducedData.length; i++) {
      const point = reducedData[i];
      const post = assignedTopicsData[i];
      const letter = lettersData[post.post_id];
      const topicWeights = assignedTopicsData[i]["all_weights"];
      const topTopic = post.topics.first.topic;
      const topLabel = topicsRefData[topTopic].label;
      const color = colors[topTopic];

      // Plot the data points as circles
      chartSVG
        .append("circle")
        .attr("cx", xScale(point.x) + chartLeftMargin) // Set x pos as 1st tsne component
        .attr("cy", yScale(point.y)) // Set y pos as 2nd tsne component
        .attr("r", 5)
        .attr("fill", color)
        .attr("data-topic", topTopic) // associate with topic for filtering
        .attr("opacity", function () {
          // Check if the point's topic is in activeTopicsLocal (or else it would just all be same opacity initially)
          const topic = +d3.select(this).attr("data-topic");
          return activeTopicsLocal.has(topic) ? 0.8 : 0.025; // Set opacity based on active topics
        })
        .on("mouseover", (event) => {
          console.log("Mouseover triggered for: ", post.post_id);
          // console.log(
          //   `Tooltip content: Dominant Topic: ${topLabel}, Letter Title: ${letter.title}`
          // );
          const [x, y] = d3.pointer(event);

          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(
              // `Dominant Topic: ${topLabel}<br>X: ${point.x.toFixed(
              //   2
              // )}<br>Y: ${point.y.toFixed(2)}`
              `<strong>${topLabel}</strong><br><span style=" display: block; font-style: italic;">"${letter.title}"</span></h3>`
            )
            .style("left", `${x + 15}px`)
            .style("top", `${y + 50}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        })
        .on("click", (event) => {
          console.log("clicked on post: ", post.post_id);

          // if there were prev selected points, reset it so highlights don't persist
          if (selectedPt) {
            selectedPt.style("opacity", 0.8);
            selectedPt.attr("stroke", "000");
          }

          selectedPt = d3.select(event.target);
          // lower opacity for unfiltered posts
          if (activeTopicsLocal.size !== 0) {
            chartSVG.selectAll("circle").style("opacity", function () {
              const topic = +d3.select(this).attr("data-topic");
              const isFiltered =
                activeTopicsLocal.size === 0 || activeTopicsLocal.has(topic);
              return selectedPt.node() === this || isFiltered ? 0.8 : 0.025;
            });
          } else {
            chartSVG.selectAll("circle").style("opacity", 0.1);
            selectedPt.style("opacity", 0.8);
          }

          // increase opacity and put border for specific, selected point
          selectedPt
            .style("opacity", 1)
            .attr("stroke", "black")
            .attr("stroke-width", "2.5");

          // zoom into selected point area
          const pointX = xScale(point.x) + chartLeftMargin; // account for the legend padding
          const pointY = yScale(point.y);
          const zoomCenterX = chartContainerW / 2 - pointX; // the center of the chart (account for padding)
          const zoomCenterY = chartContainerH / 2 - pointY;

          // zoom in by 2
          const zoomedInScale = zoomScale * 2;
          zoom.scaleTo(chartSVG, zoomedInScale);

          // zoom transition and eased animation with time duration of 1000 ms
          chartSVG
            .transition()
            .duration(1000)
            .call(
              zoom.transform,
              d3.zoomIdentity
                .translate(zoomCenterX, zoomCenterY)
                .scale(zoomedInScale)
            );

          // update the details panel
          const sortedWeights = topicWeights
            .map((weight, index) => ({
              index,
              weight,
            }))
            .sort((a, b) => b.weight - a.weight);

          const formattedWeights = sortedWeights.map(
            (item) =>
              `${topicsRefData[item.index].label}: ${item.weight.toFixed(5)}`
          );
          d3.select("#details-content").html(
            `<p>${clickOutMsg}</p>
              <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background-color: #fff;">
                <h3 style="margin: 0; font-size: 10; text-align: left;">${
                  letter.title
                }</h3>
                <p style="font-size: 1; color: #555;">By <strong>${
                  letter.username
                }
                  </strong> on ${new Date(
                    letter.createdAt
                  ).toLocaleDateString()}
                </p>
                <p style="margin-top: 10px; font-size: 0.3; color: #333;">
                  ${
                    letter.body.length > 300
                      ? letter.body.substring(0, 300) + "..."
                      : letter.body
                  }
                </p>
                <a href="${
                  letter.url
                }" target="_blank">See the original post.</a>
              </div>
              <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background-color: #fff;">
                <strong style="margin: 0; font-size: 3; text-align: left;">Topic Weights Distribution</strong>
                <ol>
                  ${formattedWeights
                    .map((topic) => `<li>${topic}</li>`)
                    .join("")}
                </ol>
                </div>`
          );
          event.stopPropagation(); // Prevent zoom click from propagating to the background
        });

      // set default if nothing is selected
      d3.select("#details-content").html(
        `${clickInMsg}${topicExplanationHeader}${defaultDetailsPanelHTML}`
      );

      // track click events throughout the entire body
      // (if user clicks outside, it'll reset point selection)
      d3.select("#chart-container").on("click", (event) => {
        if (selectedPt) {
          // check: click position is anywhere other than the currently selected point
          if (!selectedPt.node().contains(event.target)) {
            chartSVG.selectAll("circle").attr("stroke", "null"); // remove outline to be transparent

            updatePointOpacities();

            // reset the details box
            d3.select("#details-content").html(
              `${clickInMsg}${topicExplanationHeader}${defaultDetailsPanelHTML}`
            );
            // no points are selected anymore so val should be null
            selectedPt = null;
            chartSVG.transition().duration(750).call(
              zoom.transform,
              d3.zoomIdentity // Reset zoom and transition
            );
          }
        }
      });
    }

    const legendContainer = d3.select("#legend");
    legendContainer.selectAll("*").remove();

    // for each topic, get color and append to legend
    colors.forEach((color, index) => {
      // console.log("Legend item created for topic:", index); // Debugging log
      const topicLabel = topicsRefData[index].label;
      const topicDescription = topicsRefData[index].description;
      // console.log(topicDescription);
      const legendItem = legendContainer
        .append("div")
        .attr("class", "legend-item")
        .on("click", () => {
          toggleTopicOpacity(index, legendItem);
          console.log(`${topicsRefData[index].label} selected`);
        })
        .on("mouseover", () => {
          tooltip.transition().duration(200).style("opacity", 1);
          tooltip
            .html(
              `<strong>${topicLabel}</strong><br><br>${topicDescription}<br><br><strong>Top Words: </strong>${topicsRefData[
                index
              ].top_words.join(", ")}`
            )
            .style("left", `${10}px`)
            .style("top", `${375}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(200).style("opacity", 0);
        });

      if (activeTopicsLocal.has(index)) {
        legendItem.classed("selected", true); // Highlight as selected if topic is active
      } else {
        legendItem.classed("selected", false); // Remove highlight if not active
      }

      legendItem
        .append("svg")
        .attr("width", 18)
        .attr("height", 18)
        .append("rect")
        .attr("fill", color);

      legendItem.append("text").text(topicLabel).style("margin-left", "5px");
    });
  });

  return (
    <div id="outer-container">
      <div id="chart-container">
        <h3>T-SNE Visualization of Topic Modeling</h3>
        <svg id="chart"></svg>
        <div id="legend">
          <p>Select topic filters here:</p>
        </div>
        <div id="tooltip" className="tooltip"></div>
      </div>
      <div id="details-box">
        <h2>Love Letter Details</h2>
        <div id="details-content">
          <p>Click on a point to see more details here.</p>
        </div>
      </div>
    </div>
  );
};

export default TSNEVisualization;
