"use client";
import React, { useEffect } from "react";

import * as d3 from "d3";
import "./topic-styling.css";

const TSNEVisualization = ({
  title,
  id,
  activeTopics = new Set(),
  defaultDetailsPanelHTML = "",
  editable = true,
  dataFiles = {
    assignedTopics: "/data/topic-modeling/results/top_topics_with_weights.json",
    topicsRef: "/data/topic-modeling/results/topics_NMF_15.json",
    tsneReducedData: "/data/topic-modeling/results/tsne-reduced-data.json",
    lettersData: "/data/consolidated_posts.json",
  },
}) => {
  let selectedPt = null;

  useEffect(() => {
    updatePointOpacities();
  }, [updatePointOpacities]);

  let activeTopicsLocal = new Set(activeTopics);

  function updatePointOpacities() {
    // Check if there are no active topics selected
    const isTopicsArrEmpty = activeTopicsLocal.size === 0;

    d3.selectAll(`#${id}-chart circle`).style("opacity", function () {
      const topic = +d3.select(this).attr("data-topic");
      const isActiveTopic = activeTopicsLocal.has(topic);

      // if there is a point selected, always give the selected point high opacity
      if (selectedPt && d3.select(this).node() === selectedPt.node()) {
        return 0.8;
      }

      // if no topics are filtered, give high opacity to all points
      if (isTopicsArrEmpty) {
        return 0.8;
      }

      // if there are topics filtered, give high opacity ONLY to the points in those topics
      return isActiveTopic ? 0.8 : 0.025;
    });
  }

  // function for keeping track of filter selections
  function toggleTopicOpacity(topicIndex, legendItem) {
    if (editable) {
      // unselect topic
      if (activeTopicsLocal.has(topicIndex)) {
        activeTopicsLocal.delete(topicIndex);
        legendItem.classed("selected", false);
        console.log("active topics: ", activeTopicsLocal);
      } else {
        // select topic
        activeTopicsLocal.add(topicIndex);
        legendItem.classed("selected", true);
        console.log("active topics: ", activeTopicsLocal);
      }
      updatePointOpacities();
    }
  }

  // Load the topic assignments, topic reference file, TSNE reduced data, and consolidated posts info
  Promise.all([
    d3.json(dataFiles.assignedTopics),
    d3.json(dataFiles.topicsRef),
    d3.json(dataFiles.tsneReducedData),
    d3.json(dataFiles.lettersData),
  ]).then(([assignedTopicsData, topicsRefData, reducedData, lettersData]) => {
    // Set the canvas and chart dimensions
    const width = 700;
    const height = 500;
    const margin = 40;
    const chartLeftMargin = 160;
    const chartContainerW = 925;
    const chartContainerH = 600;

    // Select the SVG element chart and tooltip (these are the things that should be loading the plots)
    const chartSVG = d3.select(`#${id}-chart`);
    const tooltipTopic = d3.select(`#${id}-tooltip`);

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
        // d3.select(`#${id}-chart`).attr("transform", event.transform)
      });

    // detail panel instructions for on-click
    const clickInMsg = `<p style="font-size: 12px; color: #333;"><i>Click on a point to see more details about the love letter.</i></p>`;
    const clickOutMsg = `<p style="font-size: 12px; color: #333;"><i>Explore another point or click anywhere outside the point to unselect.</i></p>`;

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

    // point selection variables
    let zoomScale = 1;
    for (let i = 0; i < reducedData.length; i++) {
      const point = reducedData[i];
      const post = assignedTopicsData[i];
      const letter = lettersData[post.post_id];
      const topicWeights = assignedTopicsData[i]["all_weights"];
      const topTopic = post.topics.first.topic;
      const topLabel = topicsRefData[topTopic].label;
      const color = topicsRefData[topTopic].color;

      // Plot the data points as circles

      chartSVG
        .append("circle")
        .attr("cx", xScale(point.x) + chartLeftMargin) // Set x pos as 1st tsne component
        .attr("cy", yScale(point.y)) // Set y pos as 2nd tsne component
        .attr("r", 4)
        .attr("fill", color)
        .attr("data-topic", topTopic) // associate with topic for filtering
        .attr("opacity", function () {
          // if there are no selected topics, just make all the same high opacity
          if (activeTopicsLocal.size === 0) {
            return 0.8;
          }
          // Check if the point's topic is in activeTopicsLocal (or else it would just all be same opacity initially)
          const topic = +d3.select(this).attr("data-topic");
          return activeTopicsLocal.has(topic) ? 0.8 : 0.025; // Set opacity based on active topics
        })
        .on("mouseover", (event) => {
          // Show the tooltip with word details
          tooltip
            .style("opacity", 1)
            .html(
              `<strong style="font-size: 12px">${topLabel}</strong><br><p style="font-style: italic; font-size: 12px; color: #fff; margin: 0;">"${letter.title}"</p></h3>`
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
        })
        .on("click", (event) => {
          console.log("clicked on post: ", post.post_id);
          console.log("SELECTED ON CLICK: ", selectedPt);

          // if there were prev selected points, reset it so highlights don't persist
          if (selectedPt) {
            const prevPtTopic = selectedPt.attr("data-topic");
            const isSelectedTopic = activeTopicsLocal.has(prevPtTopic);

            console.log("Resetting previous point:", {
              topic: prevPtTopic,
              isActive: isSelectedTopic,
            });

            selectedPt
              .attr("stroke", null)
              .attr("opacity", isSelectedTopic ? 0.8 : 0.025);
          }

          selectedPt = d3.select(event.target);
          console.log(selectedPt);

          // increase border and opacity around selected point
          selectedPt
            .attr("opacity", 0.8)
            .attr("stroke", "black")
            .attr("stroke-width", 2.5);

          console.log("New selected point:", {
            topic: selectedPt.attr("data-topic"),
            opacity: selectedPt.attr("opacity"),
          });

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

          // get all the topic weights and sort from highest weight to lowest
          const sortedWeights = topicWeights
            .map((weight, index) => ({
              index,
              weight,
            }))
            .sort((a, b) => b.weight - a.weight);

          // write the weights in "topic: weight" form
          const formattedWeights = sortedWeights.map(
            (item) =>
              `${topicsRefData[item.index].label}: ${item.weight.toFixed(5)}`
          );

          // update the details panel
          d3.select(`#${id}-details-content`).html(
            `<p>${clickOutMsg}</p>
             <div style="padding: 15px; border-radius: 8px; background-color: #ffff; width: 100%; max-width: 600px; margin: 0 auto;">
              <strong style="font-size: 1.2em; margin: 0 0 10px 0; color: #333; text-align: left;">${
                letter.title
              }</strong>
              <p style="font-size: 0.9em; color: #777; margin: 0 0 15px 0;">
                <strong>${letter.username}</strong> on ${new Date(
              letter.createdAt
            ).toLocaleDateString()}
              </p>
              <p style="font-size: 1em; color: #555; line-height: 1.5;">
                ${
                  letter.body.length > 300
                    ? letter.body.substring(0, 300) + "..."
                    : letter.body
                }
              </p>
              <a href="${letter.url}" target="_blank">See the original post.</a>
              </div>
              <p></p>
              <div style="padding: 10px; border-radius: 5px; background-color: #ffff;">
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
      d3.select(`#${id}-details-content`).html(
        `${clickInMsg}${defaultDetailsPanelHTML}`
      );

      // track click events throughout the entire body
      // (if user clicks outside, it'll reset point selection)
      d3.select(`#${id}-chart`).on("click", (event) => {
        console.log("clicked element: ", event.target);
        console.log("inside of zoom reset, selected pt is: ", selectedPt);
        if (selectedPt) {
          // check: click position is anywhere other than the currently selected point
          if (!selectedPt.node().contains(event.target)) {
            console.log("click outside selected point");
            chartSVG.selectAll(`#${id}-chart circle`).attr("stroke-width", 0); // remove outlines

            // zooming out is the same as unselecting so selectedPt should be reset to null
            // setSelectedPt(null);
            selectedPt = null;

            updatePointOpacities(); // all unfiltered circles are lower opacity

            // reset the details box
            d3.select(`#${id}-details-content`).html(
              `${clickInMsg}${defaultDetailsPanelHTML}`
            );

            // reset the zoom
            chartSVG.transition().duration(750).call(
              zoom.transform,
              d3.zoomIdentity // Reset zoom and transition
            );
          } else {
            console.log("click on selected point");
          }
        } else {
          console.log("no selected point");
        }
      });
    }

    const legendContainer = d3.select(`#${id}-legend`);
    legendContainer.selectAll("*").remove();

    legendContainer
      .append("text")
      .text("Topics")
      .style("font-size", "12px")
      .style("font-weight", "bold");

    // for each topic, get color and append to legend
    Object.keys(topicsRefData).forEach((legendIndex) => {
      // console.log("Legend item created for topic:", index); // Debugging log
      const topicLabel = topicsRefData[legendIndex].label;
      const topicDescription = topicsRefData[legendIndex].description;
      const color = topicsRefData[legendIndex].color;
      // console.log(topicDescription);
      const legendItem = legendContainer
        .append("div")
        .attr("class", "legend-item")
        .on("click", () => {
          toggleTopicOpacity(legendIndex, legendItem);
          console.log(`${topicsRefData[legendIndex].label} selected`);
        })
        .on("mouseover", () => {
          tooltipTopic.transition().duration(200).style("opacity", 1);
          tooltipTopic
            .html(
              `<ul style="list-style: none; padding: 0; font-size: 10px; color: #ffff;">
                <li><strong>${topicLabel}</strong></li>
                <li>${topicDescription}</li>
                <li><strong>Top Words:</strong></li>
                <li>${topicsRefData[legendIndex].top_words.join(", ")}</li>
              </ul>`
            )
            .style("left", `${10}px`)
            .style("top", `${400}px`);
        })
        .on("mouseout", () => {
          tooltipTopic.transition().duration(200).style("opacity", 0);
        });

      if (activeTopicsLocal.has(legendIndex)) {
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
    <div className="outer-container">
      <div className="chart-container" id={`#${id}-chart-container`}>
        <h4>{title}</h4>
        <svg id={`${id}-chart`} className="chart"></svg>
        <div id={`${id}-legend`} className="legend"></div>
        <div id={`${id}-tooltip`} className="tooltip"></div>
      </div>
      <div id={`${id}-details-box`} className="details-box">
        <h2>Love Letter Details</h2>
        <div id={`${id}-details-content`} className="details-content">
          <p>Click on a point to see more details here.</p>
        </div>
      </div>
    </div>
  );
};

export default TSNEVisualization;
