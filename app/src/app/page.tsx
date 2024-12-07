"use client";
import LoadingHearts from "./components/ui/loading";

import React, { useState } from "react";
import SentimentBarChart from "./components/visualizations/sentiment-posts";
import Sentiment2OverTime from "./components/visualizations/sentiment-over-time";
import SentimentHeatMap from "./components/visualizations/sentiment-heatmap";
import Length from "./components/visualizations/length-vs-sentiment";
import EmbeddingGraph from "./components/visualizations/embedding-graph";
import TopicVisualization from "./components/visualizations/p2/topic-modeling";
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
    <LoadingHearts>
      <div className="flex flex-col">
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

          <Card
            title="Slow growth at the start"
            description={`The graph depicts the number of posts over time, showing slow initial growth from **May 2021 to December 2022**, with minor spikes around early and mid-2022.

A significant upward trend begins in **January 2023**, culminating in a sharp peak by **April 2023**. The sharp increase in posts during this time suggests heightened activity around the **Valentine’s Day season**, likely reflecting increased engagement on topics such as love, relationships, or related events.`}
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

          <Card
            title="**The Wishful Thinker**"
            description="Letters from Idealistic Soulmates, Serenity and Beauty, and Vulnerability and Heartbreak"
          >
            <TopicVisualization
              id="tsne138"
              key="tsne138"
              activeTopics={new Set([1, 3, 8])}
              defaultDetailsPanelHTML="
              <strong>Key Takeaways about Selected Topics: </strong><br>
              <ul> 
                <li> 
                  Wishful thinkers commonly use metaphors that align with the word-usage in the topic <strong>Serenity and Beauty</strong>.
                </li> 
                <li> Some letters from <strong>Idealistic Soulmates</strong> also closely align with the word-usage from <strong>Vulnerability and Heartbreak</strong>. </li>
                <li> This shows how vulnerable emotional states may spur language similar to that of a wishful thinker.
                </li>
              </ul>"
            />
          </Card>

          <Card
            title="**Idealistic Soulmates Subtopics**"
            description="Letters from Idealistic Soulmates have soft associations with other topics as well."
          >
            <TopicVisualization
              id="tsne146"
              key="tsne146"
              activeTopics={new Set([1, 4, 6])}
              defaultDetailsPanelHTML="
              <strong>Key Takeaways about Selected Topics: </strong><br>
              <ul>
                The letters from Idealistic Soulmates are influenced by two main themes which show a split within the topic itself:
                <li><strong>Playful Flirtation</strong>
                  <ul>
                    <li>Half of the letters express physical and sexual longing using casual language, similar to the tone found in Playful Flirtation letters.</li>
                  </ul>
                </li>
                <li><strong>Reflection on Life Journey</strong>
                  <ul>
                    <li>The other half reflect on the past or dream about the future, using deeper language reminiscent of letters that focus on life journeys.</li>
                  </ul>
                </li>
              </ul>"
            />
          </Card>

          <Card
            title="**Connections between Vulnerability and Reflecting on Moments of Time**"
            description="Letters on Vulnerability and Hearbreak share language with letters from Reflections on Moments of Time"
          >
            <TopicVisualization
              id="tsne08"
              key="tsne08"
              activeTopics={new Set([0, 8])}
              defaultDetailsPanelHTML="
              <strong>Key Takeaways about Selected Topics: </strong><br>
              <ul>
                Authors who write about Heartbreak and Vulnerability commonly reminisce or recall the happier moments of the past. In some letters, they look towards the past with regret and guilt, sharing their vulnerability in the love letter.
              </ul>"
            />
          </Card>

          <Card
            title="**Your turn to explore!**"
            description="Hover over the topics in the legend to learn more about each topic. Filter by topic and click on individual points to further explore each letter."
          >
            <TopicVisualization id="tsneExplore" key="tsneExplore" />
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
      </div>
    </LoadingHearts>
  );
}
