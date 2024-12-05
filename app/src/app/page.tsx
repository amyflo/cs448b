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
        title="**Frequency of Posts**"
        description="This visualization shows the number of posts over time."
      >
        <FrequencyOfPosts
          pointA=""
          pointB="2023-04"
          showSpecificPoints={false}
          editable={false}
        />
      </Card>
      <Card
        title="**Sentiment Over Time**"
        description="Explore how sentiment changes across different time periods."
      >
        <FrequencyOfPosts
          pointA="2023-04"
          showSpecificPoints={false}
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
