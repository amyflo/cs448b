"use client";
import LoadingHearts from "./components/ui/loading";

import React, { useState } from "react";

import Sentiment2OverTime from "./components/visualizations/sentiment/sentiment-over-time-scatterplot";
import SentimentPosts from "./components/visualizations/sentiment/sentiment-posts";
import Length from "./components/visualizations/sentiment/length-vs-sentiment";
import TransitionScreen from "./components/ui/transition";
import ThemesTransition from "./components/ui/themesTransition";
import SentimentBarChart from "./components/visualizations/sentiment/sentiment-posts";
import SentimentHeatMap from "./components/visualizations/sentiment-heatmap";
import EmbeddingGraph from "./components/visualizations/embedding-graph";
import TopicVisualization from "./components/visualizations/p2/topic-modeling";
import FrequencyOfPosts from "./components/visualizations/p1/frequency-of-posts";
import SentimentOverTime from "./components/visualizations/p1/sentiment-over-time";
import PostLength from "./components/visualizations/deprecated/post-length";
import TopicSentiment from "./components/visualizations/p2/topic-by-sentiment";
import PostLengthTopic from "./components/visualizations/p2/post-length";
import TopicSentimentBar from "./components/visualizations/p2/topic-by-sentiment-bar";
import PostLengthTopicBar from "./components/visualizations/p2/post-length-bar";
import InteractiveEmbeddingGraph from "./components/visualizations/interactive-embedding-graph";
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
          description='Letters with gendered language tend to be written from the perspective of straight women. First and second person pronouns tend to be used near the word "girl". We also see "that" and "other" more closely associated with "girl", indicating that authors of our Love Letters tend to see other women as romantic rivals. On the other hand, "dream" is more closely related to "boy", indicating that Love Letter authors are writing about men."'
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
              "scared",
            ]}
          />
        </Card>
        <Card>
          <InteractiveEmbeddingGraph />
        </Card>

        <TransitionScreen
          title="What themes emerge across love letters shared in online communities?"
          description="Scroll to walk through how we identified the key themes in the love letters."
        />

        <Card
          title="Step 1: Text Processing"
          description=" Our data cleaning process involved normalizing the text by converting it to lowercase to avoid duplicate counts, tokenizing the text into individual words or tokens for analysis, converting words to their root forms to better scale the number of unique words,  and removing common stop words such as 'the,' 'and,' and 'is' to focus on meaningful content."
        ></Card>

        <Card
          title="Step 2: Assign Topics to each Letter"
          description="We analyzed the love letters by turning them into numerical representations based on the words they contain, comparing terms that appear frequently in each letter but less often across all letters (TF-IDF). Then, we grouped similar letters together using a topic-modeling algorithm called NMF and labeled these groups with themes based on the most common words in each group."
        ></Card>

        <ThemesTransition
          themes={[
            "Reflections on Moments of Time",
            "Idealistic Soulmates",
            "Enduring Relationship Struggles",
            "Serenity and Beauty",
            "Playful Flirtation",
            "Hopeful Goodbyes",
            "Reflection on Life Journey",
            "Empathy, Forgiveness, and Apology",
            "Vulnerability and Heartbreak",
            "Playful Longing",
            "Uncertainty in Relationships",
            "Substance Use and Escapism",
            "Spirituality and Music",
            "Sexuality, Longing, and Confusion",
            "Family Dynamics",
          ]}
        ></ThemesTransition>

        <Card
          title="Letters aligned with language from multiple personas and emotional states."
          description={`Letters did not strictly cluster with a single primary topic, but instead showed **overlapping associations** with other topics as well. They often reflected multiple *personas* and *emotional states* like the **'wishful thinker'** or the **'romantic idealist'**. Nodes positioned near those from different topics are letters that share **similar word-usage**, indicating that **multiple themes** were prominent.
`}
        ></Card>

        <Card
          title="The Wishful Thinker"
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
          title="Division within the Same Topic"
          description="Letters within the same topic can be divided due to strong associations with other topics. The distinct language and tone of the author create variations within the primary topic, revealing **how different personas can emerge from the same theme.** For example, in the 'Idealistic Soulmates' topic, **we observe two contrasting personas**: one that expresses playful physical longing, and another that portrays a more serious, reflective tone."
        ></Card>

        <Card
          title="The Split in Idealistic Soulmates"
          description="Letters from Idealistic Soulmates divided between Playful Flirtation and Reflection on Life Journey"
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
          title="Time as a Lens for Vulnerability: Reflecting on the Past and Dreaming of the Future"
          description="Letters reflecting on moments in time, particularly the past and future, are closely linked to themes of vulnerability and heartbreak. Authors often **compare their present selves to their past,** reminiscing about previous experiences and **envisioning missed opportunities** or irreversible moments. They also **dream or wonder about the future**, imagining how things might have been different. In their most vulnerable moments, these authors revisit past memories or imagine future possibilities, contemplating what could have been."
        ></Card>

        <Card
          title="Close Associations between Vulnerability and Heartbreak, and Reflections on Moments of Time"
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
          title="Now, it's your turn to explore!"
          description="Hover over the legend to learn more about each topic. Select and filter by topics to discover how closely related or distinct the letters are from each other. Click on specific points to zoom in and view a snippet of the love letter, a link to the full post, and the topic weight assignments for that letter."
        ></Card>

        <Card>
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
    </LoadingHearts>
  );
}
