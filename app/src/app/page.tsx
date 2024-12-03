"use client";

import SentimentBarChart from "./components/sentiment-posts";
// import SentimentOverTime from "./components/sentiment-over-time";
import SentimentHeatMap from "./components/sentiment-heatmap";
import Length from "./components/length-vs-sentiment";
import EmbeddingGraph from "./components/embedding-graph";
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
      {/* Post Length Explanation */}
      <div>
        <h3>Post Length</h3>
        <p>
          This visualization tracks the average length of posts over time,
          showing how the verbosity of posts has evolved. It allows us to see
          whether users tend to write more or less over the course of the
          dataset.
        </p>
        <PostLength />
      </div>

      {/* Frequency of Posts Explanation */}
      <div>
        <h3>Frequency of Posts</h3>
        <p>
          This graph shows the frequency of posts over a specific period. By
          tracking the number of posts at regular intervals, we can observe
          fluctuations and trends in user engagement or activity levels.
        </p>
        <FrequencyOfPosts />
      </div>

      {/* Sentiment Over Time Explanation */}
      <div>
        <h3>Sentiment Over Time</h3>
        <p>
          This chart visualizes the sentiment of posts, plotting the average
          sentiment score across time. It helps identify any shifts in mood,
          whether positive, neutral, or negative, and highlights significant
          changes or events that might have influenced the tone.
        </p>
        <SentimentOverTime />
      </div>

      {/* TOPIC MODELLING */}

      {/* t-SNE Visualization Explanation */}
      <div>
        <h3>t-SNE Visualization</h3>
        <p>
          t-SNE is used to reduce the dimensionality of data while preserving
          the relationships between data points. This scatter plot helps
          visualize the clustering of different topics, showing how similar or
          dissimilar various topics are to one another.
        </p>
        <TSNEVisualization />
      </div>

      {/* Topic Sentiment Explanation */}
      <div>
        <h3>Topic Sentiment</h3>
        <p>
          This visualization examines the sentiment of posts within each
          identified topic. By comparing the sentiment across various topics, it
          offers insights into whether certain topics tend to attract more
          positive or negative discussions.
        </p>
        <TopicSentiment />
      </div>

      {/* Topic Sentiment Bar Explanation */}
      <div>
        <h3>Topic Sentiment Bar</h3>
        <p>
          This bar chart presents a breakdown of sentiment by topic, making it
          easy to compare the relative positivity or negativity of each topic.
          It allows users to quickly grasp which topics are linked to favorable
          or unfavorable sentiment.
        </p>
        <TopicSentimentBar />
      </div>

      {/* Post Length by Topic Explanation */}
      <div>
        <h3>Post Length by Topic</h3>
        <p>
          This chart explores how post length varies across different topics. It
          gives insight into whether certain topics are discussed in more
          detail, or if brevity is preferred for specific subject matters.
        </p>
        <PostLengthTopic />
      </div>

      {/* Post Length by Topic Bar Explanation */}
      <div>
        <h3>Post Length by Topic Bar</h3>
        <p>
          This bar chart presents the average post length for each topic. It
          provides a straightforward comparison of which topics tend to generate
          longer posts, helping to understand which discussions are more
          elaborate or concise.
        </p>
        <PostLengthTopicBar />
      </div>

      <h1>Word Association</h1>
      <EmbeddingGraph
        axis={["he", "she"]}
        points={[
          "movie",
          "book",
          "love",
          "story",
          "hate",
          "good",
          "interesting",
          "sorry",
          "silly",
          "bad",
        ]}
      />
    </div>
  );
}
