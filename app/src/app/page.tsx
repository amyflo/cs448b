"use client";
import LoadingHearts from "./components/ui/loading";

import React, { useState } from "react";

import Sentiment2OverTime from "./components/visualizations/sentiment/sentiment-over-time-scatterplot";
import SentimentPosts from "./components/visualizations/sentiment/sentiment-posts";
import Length from "./components/visualizations/sentiment/length-vs-sentiment";
import FrequencyOfPosts from "./components/visualizations/p1/frequency-of-posts";
import TransitionScreen from "./components/ui/transition";

import SentimentBarChart from "./components/visualizations/sentiment/sentiment-posts";
import SentimentHeatMap from "./components/visualizations/sentiment-heatmap";
import EmbeddingGraph from "./components/visualizations/embedding-graph";
import TSNEVisualization from "./components/visualizations/p2/topic-modelling";
import PostLength from "./components/visualizations/deprecated/post-length";
import TopicSentiment from "./components/visualizations/p2/topic-by-sentiment";
import PostLengthTopic from "./components/visualizations/p2/post-length";
import TopicSentimentBar from "./components/visualizations/p2/topic-by-sentiment-bar";
import PostLengthTopicBar from "./components/visualizations/p2/post-length-bar";
import InteractiveEmbeddingGraph from "./components/visualizations/interactive-embedding-graph"
import Card from "./components/ui/card";
import Slideshow from "./components/ui/slideshow";

export default function Home() {
  return (
    <LoadingHearts>
      <Slideshow>
        <Card
          title="Welcome to r/LoveLetters"
          description={`
**Background**

r/LoveLetters is a subreddit where users share heartfelt stories of **love**, **gratitude**, and **heartbreak** through letters and poems. With **9.4k members** as of November 2024, it ranks in the **top 7%** of subreddits by size. The community is moderated, requiring users to submit posts for approval to ensure content aligns with the subreddit’s focus. 

We chose the r/LoveLetters dataset to explore how **love is expressed through language** in an online community.

**Guiding Questions**
- How has **r/LoveLetters** changed over time?
- What topics characterize **r/LoveLetters**?
- What patterns are present in **r/LoveLetters**?
  `}
        ></Card>
        <TransitionScreen
          title="How has r/LoveLetters changed over time?"
          description="This is a description that transitions as you scroll"
        />

        {/* Post Frequency */}
        <Card
          title="Slow growth at the start"
          description={`The graph shows the number of posts over time, revealing slow initial growth from **May 2021 to December 2022**. Minor spikes can be seen in early and mid-2022, likely driven by specific events or discussions.

However, a significant upward trend begins in **January 2023**, peaking sharply by **April 2023**. This surge suggests heightened engagement during the **Valentine’s Day season**, when topics of love, relationships, and emotions likely drove a wave of activity.`}
        >
          <FrequencyOfPosts
            pointA=""
            pointB="2023-04"
            showSpecificPoints={true}
            editable={false}
          />
        </Card>
        <Card
          title="A break in submissions"
          description={`Following the sharp peak in **April 2023**, the subreddit paused submissions in **June 2023**, citing challenges with managing the growing pace of activity. 

By **November 2024**, the subreddit [reopened](https://www.reddit.com/r/LoveLetters/comments/1gej65u/rloveletters_has_been_reopened_welcome_back/), welcoming Redditors back to sharing their stories. Shortly after, activity began to pick up again, reflecting a renewed interest from the community.`}
        >
          <FrequencyOfPosts
            pointA="2023-02"
            showSpecificPoints={true}
            editable={false}
          />
        </Card>
        <Card
          title="Explore the patterns yourself"
          description="Dive deeper into post activity trends over time. Use the start and end month selectors to focus on specific periods, and hover over data points for detailed insights into post frequency."
        >
          <FrequencyOfPosts showSpecificPoints={true} editable={true} />
        </Card>

        {/* Transition Screen */}
        <TransitionScreen
          title="What is the emotional breakdown?"
          description="Scroll to reveal how emotions unfold in the shared content. This dynamic visualization uncovers the sentiment trends and emotional nuances expressed in the posts."
        />

        <Card
          title="Sentiment Analysis Overview"
          description={`When grouping posts by sentiment polarity, we find that **571 posts are positive**, while **170 are negative**. 

However, sentiment analysis tools have inherent limitations. They often rely on lexical approaches, which analyze words or phrases in isolation and struggle with **context, sarcasm, and negations**. For example, "I don't love this" might be incorrectly classified as positive due to the word "love."`}
        >
          <SentimentPosts />
        </Card>
        <Card
          title="Sentiment Over Time"
          description={`As time progresses, **positive sentiment** (red) becomes more dominant, but instances of **negative sentiment** (blue) remain, highlighting a mix of emotions within the shared posts.

Given that r/LoveLetters is a moderated subreddit, approved posts might lean towards **positive or heartfelt content**. This explains the prevalence of positive sentiment in later periods, even as some emotionally negative posts (e.g., heartbreak, loss) are still shared.`}
        >
          <Sentiment2OverTime />
        </Card>
        <Card
          title="Do longer posts express stronger emotions?"
          description={`Short posts tend to cluster around neutral sentiment (colored white and light red or blue), with fewer extreme values. The cluster near neutral sentiment for short posts might also suggest that shorter posts lack sufficient text to produce extreme sentiment scores.

On the other hand, longer posts often convey a wider range of emotions, with many leaning towards **positive sentiment** (red). Longer posts may convey stronger emotions, leading to higher sentiment scores (both positive and negative).`}
        >
          <Length />
        </Card>
        <Card
          title="Gendered Language in the Love Letters"
          description=
          'Letters with gendered language tend to be written from the perspective of straight women. First and second person pronouns tend to be used near the word "girl". We also see "that" and "other" more closely associated with "girl", indicating that authors of our Love Letters tend to see other women as romantic rivals. On the other hand, "dream" is more closely related to "boy", indicating that Love Letter authors are writing about men."'
        >
          <EmbeddingGraph
            axis={["boy", "girl"]}
            points={[
              "i",
              "me",
              "my",
              "im",
              "you",
              "your",
              "youre",
              "yours",
              "that",
              "other",
              "dream",
            ]}
          />
        </Card>
        <Card>
        <EmbeddingGraph
          axis={["man", "woman"]}
          points={[
            "angry",
            "sad",
            "happy",
            "crazy",
            "scared",
            "stupid",
            "emotional",
          ]}
        />
        </Card>
        <Card>
        <EmbeddingGraph
          axis={["boy", "girl"]}
          points={[
            "angry",
            "sad",
            "happy",
            "crazy",
            "scared",
            "stupid",
            "emotional",
          ]}
        />
        </Card>
        <Card>
        <EmbeddingGraph
          axis={["i", "you"]}
          points={[
            "regret",
            "feel",
            "wonder",
            "know",
            "cry",
            "worry",
            "fear",
            "wish",

          ]}
        />
        </Card>
        <Card>
        <EmbeddingGraph
          axis={["im", "youre"]}
          points={[
            "angry",
            "quiet",
            "sad",
            "happy",
            "empty",
            "emotional",
            "nothing",
            "everything",
            "scared"
          ]}
        />
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
    </LoadingHearts>
  );
}
