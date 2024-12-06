"use client";

import React, { useState } from "react";
import SentimentBarChart from "./components/visualizations/sentiment-posts";
import Sentiment2OverTime from "./components/visualizations/sentiment-over-time";
import SentimentHeatMap from "./components/visualizations/sentiment-heatmap";
import Length from "./components/visualizations/length-vs-sentiment";
import EmbeddingGraph from "./components/visualizations/embedding-graph";
import TSNEVisualization from "./components/visualizations/p2/topic-modelling";
import PostLength from "./components/visualizations/p1/post-length";
import FrequencyOfPosts from "./components/visualizations/p1/frequency-of-posts";
import SentimentOverTime from "./components/visualizations/p1/sentiment-over-time";
import TopicSentiment from "./components/visualizations/p2/topic-by-sentiment";
import PostLengthTopic from "./components/visualizations/p2/post-length";
import TopicSentimentBar from "./components/visualizations/p2/topic-by-sentiment-bar";
import PostLengthTopicBar from "./components/visualizations/p2/post-length-bar";
import Card from "./components/ui/card";
import Slideshow from "./components/ui/slideshow";

export default function Home() {
  return (
    <Slideshow>
      <Card
        title="**Slow Growth**"
        description={`The graph depicts the number of posts over time, showing slow initial growth from **May 2021 to December 2022**, with minor spikes around early and mid-2022.

A significant upward trend begins in **January 2023**, culminating in a sharp peak by **March 2023**.

The sharp increase in posts during this time suggests heightened activity around the **Valentine’s Day season**, likely reflecting increased engagement on topics such as love, relationships, or related events.`}
      >
        <FrequencyOfPosts
          pointA=""
          pointB="2023-04"
          showSpecificPoints={true}
          editable={false}
        />
      </Card>
      <Card
        title="**Sentiment Over Time**"
        description="Explore how sentiment changes across different time periods."
      >
        <FrequencyOfPosts
          pointA="2023-02"
          showSpecificPoints={true}
          editable={false}
        />
      </Card>
      <Card
        title="**Sentiment Over Time**"
        description="Explore how sentiment changes across different time periods."
      >
        <FrequencyOfPosts showSpecificPoints={true} editable={true} />
      </Card>

      {/* // INSTRUCTIONS

      Please just format your visualizations like this: <Card
        title="Sentiment Over Time"
        description="Explore how sentiment changes across different time periods."
      >
        <Your Visualization Component/>
      </Card>

where the title and description can both be written using markdown for easy rich text formatting!! */}
    </Slideshow>
  );
}
