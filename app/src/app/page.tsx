"use client";

import SentimentBarChart from "./components/sentiment-posts";
// import SentimentOverTime from "./components/sentiment-over-time";
import SentimentHeatMap from "./components/sentiment-heatmap";
import Length from "./components/length-vs-sentiment";
import TSNEVisualization from "./components/p2/topic-modelling";
import PostLength from "./components/p1/post-length";
import FrequencyOfPosts from "./components/p1/frequency-of-posts";
import SentimentOverTime from "./components/p1/sentiment-over-time";
import TopicSentiment from "./components/p2/topic-by-sentiment";
import PostLengthTopic from "./components/p2/post-length";
import TopicSentimentBar from "./components/p2/topic-by-sentiment-bar";
import PostLengthTopicBar from "./components/p2/post-length-bar";

export default function Home() {
  return (
    <div className="">
      // GENERAL TRENDS
      <PostLength />
      <FrequencyOfPosts />
      <SentimentOverTime />
      // TOPIC MODELLING
      <TSNEVisualization />
      <TopicSentiment />
      <TopicSentimentBar />
      <PostLengthTopic />
      <PostLengthTopicBar />
      //
    </div>
  );
}
