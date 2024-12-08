"use client";
import LoadingHearts from "./components/ui/loading";

import React from "react";

import Sentiment2OverTime from "./components/visualizations/sentiment/sentiment-over-time-scatterplot";
import SentimentPosts from "./components/visualizations/sentiment/sentiment-posts";
import Length from "./components/visualizations/sentiment/length-vs-sentiment";
import TransitionScreen from "./components/ui/transition";
import ThemesTransition from "./components/ui/themesTransition";
import TopicVisualization from "./components/visualizations/p2/topic-modeling";
import FrequencyOfPosts from "./components/visualizations/p1/frequency-of-posts";
import InteractiveEmbeddingGraph from "./components/visualizations/interactive-embedding-graph";
import Card from "./components/ui/card";
import Slideshow from "./components/ui/slideshow";
import Hero from "./components/ui/hero";

// unused for now
import SentimentOverTime from "./components/visualizations/sentiment/sentiment-over-time-scatterplot";
import PostLength from "./components/visualizations/deprecated/post-length";
import TopicSentiment from "./components/visualizations/p2/topic-by-sentiment";
import PostLengthTopic from "./components/visualizations/p2/post-length";
import TopicSentimentBar from "./components/visualizations/p2/topic-by-sentiment-bar";
import PostLengthTopicBar from "./components/visualizations/p2/post-length-bar";
import SentimentBarChart from "./components/visualizations/sentiment/sentiment-posts";
import SentimentHeatMap from "./components/visualizations/sentiment-heatmap";
import EmbeddingGraph from "./components/visualizations/deprecated/embedding-graph";

export default function Home() {
  return (
    <LoadingHearts>
      <Slideshow>
        <Hero />
        <div>
          <Card
            title="Discover r/LoveLetters"
            description={`With 9.4k members as of November 2024, it ranks in the top 7% of subreddits by size. The community is moderated, requiring users to submit posts for approval to ensure content aligns with the subreddit’s focus.`}
          />
          <Card
            title="Dataset Overview"
            description={`
For our analysis, we scraped data from the **r/LoveLetters** subreddit, spanning posts from **2021 to November 2024**, totaling **843** posts. Due to Reddit's scraping limitations, this timeframe constrained our dataset's scope. However, we successfully collected a comprehensive set of posts and comments, organizing them into structured **JSON files**. Each file grouped posts by unique IDs, nesting associated comments under their corresponding posts. This structure streamlined the process of linking posts and comments for analysis.
  `}
          />
        </div>

        {/* ********************************* POSTING CARDS START HERE ********************************* */}
        <TransitionScreen
          title="How has r/LoveLetters evolved over time?"
          description="This section examines the subreddit’s growth, stagnation, and resurgence through the lens of posting frequency."
        />
        <Card
          title="Growth Reflecting Cultural Rhythms"
          howToUse="This chart visualizes the total posts in r/LoveLetters over the given time period. Hover over a point to see the month, the number of posts for that month, and the cumulative total of posts up to that point."
          howItWasCreated="This chart aggregates the number of posts per month by processing data scraped from the r/LoveLetters subreddit. The dataset includes timestamps for each post, which were grouped into monthly intervals to create the visualization."
          description={`From **May 2021 to December 2022**, posting frequency grew steadily, punctuated by occasional spikes likely tied to significant events or community-driven discussions. 

A turning point emerges in **January 2023**, coinciding with the lead-up to Valentine’s Day. A subsequent peak in **April 2023** suggests that the subreddit serves as an emotional outlet during culturally significant moments centered on love and relationships. This seasonality mirrors broader cultural patterns, where holidays and anniversaries often amplify emotional reflection.`}
        >
          <FrequencyOfPosts
            title="Total Posts Over Time in r/LoveLetters (April 2021–April 2023)"
            pointA=""
            pointB="2023-04"
            showSpecificPoints
          />
        </Card>
        <Card
          title="Adapting to Growth: A Pause and Rebirth"
          howToUse="This chart visualizes the total posts in r/LoveLetters over the given time period. Hover over a point to see the month, the number of posts for that month, and the cumulative total of posts up to that point."
          howItWasCreated="This chart aggregates the number of posts per month by processing data scraped from the r/LoveLetters subreddit. The dataset includes timestamps for each post, which were grouped into monthly intervals to create the visualization."
          description={`Following the April 2023 peak, r/LoveLetters experienced a self-imposed hiatus in **June 2023**, citing challenges in maintaining quality amid increasing activity. This reflects a common tension in online spaces: balancing growth with the preservation of core values.

The subreddit reopened in **November 2024**, signaling a renewed commitment to its mission. Activity levels rebounded, though at a moderated pace, suggesting that the community successfully weathered this period of transformation. This resilience underscores the importance of moderation in sustaining trust and focus in online communities.`}
        >
          <FrequencyOfPosts
            title="Total Posts Over Time in r/LoveLetters (February 2023–November 2024)"
            pointA="2023-02"
            showSpecificPoints
          />
        </Card>
        <Card
          title="Explore the timeline"
          howToUse="This chart visualizes the total posts in r/LoveLetters over time. Use the dropdowns on the side to select a start and end month to zoom into a specific period. Click the reset button to view the entire dataset again. Hover over a point to see the month, the number of posts for that month, and the cumulative total of posts up to that point."
          howItWasCreated="This chart aggregates the number of posts per month by processing data scraped from the r/LoveLetters subreddit. The dataset includes timestamps for each post, which were grouped into monthly intervals to create the visualization."
          description="Use the interactive timeline to uncover correlations between posting trends and external events or cultural shifts."
        >
          <FrequencyOfPosts
            title="Total Posts Over Time in r/LoveLetters (April 2021–November 2024)"
            showSpecificPoints
            editable
          />
        </Card>

        {/* ********************************* EMOTION CARDS START HERE ********************************* */}

        {/* Transition Screen */}
        <TransitionScreen
          title="What is the emotional breakdown?"
          description="This is TBD"
        />

        <Card
          title="An Emotional Landscape: The Prevalence of Positivity"
          howToUse="This chart displays the number of posts classified as positive, neutral, or negative. The bars represent the sentiment categories."
          howItWasCreated="The chart was generated leveraging sentiment scores from a JSON dataset analysed using Sentiment.js. The bars are color-coded to represent sentiment polarity, with animations triggered when the chart is rendered. Negative posts are have a sentiment score less than zero, while positive posts have a sentiment score greater than zero."
          description={`Sentiment analysis was used to quantify the emotional tone of posts in r/LoveLetters. Numerical scores were assigned based on a predefined lexicon, where positive words like "love" or "happy" received positive scores, and negative words like "regret" or "sad" received negative scores. Context was considered to improve accuracy, and the magnitude of each score reflects the intensity of the emotion expressed.

The analysis reveals that **68% (571 posts) express positive sentiment**, while **20% (170 posts) exhibit negative sentiment**. This highlights the dual purpose of r/LoveLetters: a space for celebrating joy and hope, as well as for processing pain and grief. The positive skew of the posts may be due to the subreddit’s focus on love and gratitude, moderation policies that encourage uplifting content, or the natural tendency of users to share positive experiences more openly.`}
        >
          <SentimentPosts />
        </Card>
        <Card
          title="Do Longer Posts Convey Greater Emotion?"
          howItWasCreated="We used Sentiment.js to calculate sentiment scores for each post in the dataset. Sentiment.js assigns a numerical score based on the presence of positive and negative words in the text. Posts with higher positive scores reflect stronger positive sentiment, while negative scores indicate negative sentiment. To better visualize the relationship between post length and sentiment, we plotted post lengths on a logarithmic scale, as lengths varied widely across posts. This scaling allowed for a clearer comparison by reducing the impact of outliers and emphasizing patterns in the data."
          howToUse="This scatterplot shows sentiment scores on the y-axis and post lengths on the x-axis. Each dot represents a post, with its color indicating its sentiment (positive, neutral, or negative). A dotted line at y=0 marks neutral sentiment. Hover over a dot to view its title, date, sentiment score, and post length, and click on a dot to see detailed information about the post in the details panel."
          description={`Longer posts tend to express greater emotional intensity, with extremes in both positive and negative sentiment. Shorter posts, on the other hand, often cluster near neutrality, possibly due to limited narrative depth.

This observation suggests that longer narratives allow for more nuanced and varied emotional expression.`}
        >
          <Length />
        </Card>

        <Card
          title="How has sentiment in r/LoveLetters changed over time?"
          howItWasCreated="We used Sentiment.js to calculate sentiment scores for each post in the dataset. Sentiment.js assigns a numerical score based on the presence of positive and negative words in the text. Posts with higher positive scores reflect stronger positive sentiment, while negative scores indicate negative sentiment."
          howToUse="This scatterplot shows sentiment scores on the y-axis and the months on the x-axis. Each dot represents a post, with its color indicating its sentiment (positive, neutral, or negative). A dotted line at y=0 marks neutral sentiment. Hover over a dot to view its title, date and sentiment score, and click on a dot to see detailed information about the post in the details panel."
          description={`Zooming in on November 2021 to June 2023 before r/Loveletters was temporarily closed, we see that sentiment trends reveal that positivity (red) has become increasingly dominant over time. This skew towards positivity reflects both the subreddit’s moderation policies and its focus on uplifting, heartfelt content. However, the presence of negative sentiment—particularly in posts about heartbreak or regret—reveals that vulnerability is equally welcome.`}
        >
          <Sentiment2OverTime />
        </Card>

        {/* ********************************* Language modelling CARDS START HERE ********************************* */}
        <TransitionScreen
          title="What does language reveal about love letters?"
          description="Analyzing language usage uncovers subtle societal dynamics and emotional patterns."
        />
        <Card
          title="Gendered Language in the Love Letters"
          description='Letters with gendered language tend to be written from the perspective of straight women. First and second person pronouns tend to be used near the word "girl". We also see "that" and "other" more closely associated with "girl", indicating that authors of our Love Letters tend to see other women as romantic rivals. On the other hand, "dream" is more closely related to "boy", indicating that Love Letter authors are writing about men."'
        >
          <InteractiveEmbeddingGraph
            id="boy-girl"
            axis={["boy", "girl"]}
            axisEditable={false}
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
          <InteractiveEmbeddingGraph
            id="man-woman"
            axis={["man", "woman"]}
            axisEditable={false}
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
          <InteractiveEmbeddingGraph
            id="boy-girl-2"
            axis={["boy", "girl"]}
            axisEditable={false}
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
          <InteractiveEmbeddingGraph
            id="me-you"
            axis={["i", "you"]}
            axisEditable={false}
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
        <Card title="diy">
          <InteractiveEmbeddingGraph
            id="diy"
            axis={["love", "hate"]}
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

        {/* ********************************* TOPIC MODELING CARDS START HERE ********************************* */}
        <TransitionScreen
          title="What themes emerge across love letters shared in online communities?"
          description="We analyzed the love letters by turning them into numerical representations based on the words they contain, comparing terms that appear frequently in each letter but less often across all letters (TF-IDF). Then, we grouped similar letters together using a topic-modeling algorithm called NMF and labeled these groups with themes based on the most common words in each group."
        />

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
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Select topics on the legend to filter the datapoints by theme. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          title="Letters aligned with language from multiple personas and emotional states."
          description={`Letters did not strictly cluster with a single primary topic, but instead showed **overlapping associations** with other topics as well. They often reflected multiple *personas* and *emotional states* like the **'wishful thinker'** or the **'romantic idealist'**. Nodes positioned near those from different topics are letters that share **similar word-usage**, indicating that **multiple themes** were prominent.
`}
        >
          <TopicVisualization
            id="tsne138"
            key="tsne138"
            title="Title of visualization"
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
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Select topics on the legend to filter the datapoints by theme. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          description="Letters within the same topic can be divided due to strong associations with other topics. The distinct language and tone of the author create variations within the primary topic, revealing **how different personas can emerge from the same theme.** For example, in the 'Idealistic Soulmates' topic, **we observe two contrasting personas**: one that expresses playful physical longing, and another that portrays a more serious, reflective tone. Letters from Idealistic Soulmates divided between Playful Flirtation and Reflection on Life Journey"
        >
          <TopicVisualization
            id="tsne146"
            key="tsne146"
            title="Title of visualization"
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
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Select topics on the legend to filter the datapoints by theme. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          title="Time as a Lens for Vulnerability: Reflecting on the Past and Dreaming of the Future"
          description="Letters on Vulnerability and Hearbreak share language with letters from Reflections on Moments of Time. Letters reflecting on moments in time, particularly the past and future, are closely linked to themes of vulnerability and heartbreak. Authors often **compare their present selves to their past,** reminiscing about previous experiences and **envisioning missed opportunities** or irreversible moments. They also **dream or wonder about the future**, imagining how things might have been different. In their most vulnerable moments, these authors revisit past memories or imagine future possibilities, contemplating what could have been. "
        >
          <TopicVisualization
            id="tsne08"
            key="tsne08"
            title="Title of visualization"
            activeTopics={new Set([0, 8])}
            defaultDetailsPanelHTML="
              <strong>Key Takeaways about Selected Topics: </strong><br>
              <ul>
                Authors who write about Heartbreak and Vulnerability commonly reminisce or recall the happier moments of the past. In some letters, they look towards the past with regret and guilt, sharing their vulnerability in the love letter.
              </ul>"
          />
        </Card>

        <Card
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes. Select topics on the legend to filter the datapoints by theme. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          title="Now, it's your turn to explore!"
          description="Hover over the legend to learn more about each topic. Select and filter by topics to discover how closely related or distinct the letters are from each other. Click on specific points to zoom in and view a snippet of the love letter, a link to the full post, and the topic weight assignments for that letter."
        >
          <TopicVisualization
            title="Title of visualization"
            id="tsneExplore"
            key="tsneExplore"
          />
        </Card>

        <Card
          title="Conclusion"
          description={`The r/LoveLetters subreddit provides a unique space where people share their deepest emotions—love, gratitude, heartbreak, and hope. 
            
This analysis of the community reveals its growth over time, emotional patterns in posts, and the powerful language used to express universal experiences. 

The subreddit has grown steadily since 2021, with activity peaks tied to culturally significant moments like Valentine’s Day. In June 2023, r/LoveLetters paused to maintain its core values in the face of rapid growth but successfully reopened in November 2024. 

Sentiment analysis shows that 77% of posts are positive, reflecting themes of love, joy, and gratitude. However, 23% of posts carry negative emotions such as heartbreak and regret, showing the subreddit’s dual role as a space for celebrating love and processing pain. This balance between positivity and vulnerability is central to its identity.


The analysis of language reveals societal patterns in how love is expressed. For example, words like "dream" are often associated with "boy," while words like "that" and "other" are linked to "girl," suggesting cultural narratives embedded in personal stories. Thematic modeling uncovered key topics such as "Vulnerability and Heartbreak," "Playful Flirtation," and "Reflections on Time," showing how love letters often reflect a mix of emotions and perspectives.

    
Through its evolution, r/LoveLetters has proven to be a meaningful space where people can connect and express themselves. The stories shared within this community highlight the timeless nature of love and the universal need to share and process our emotions. Whether uplifting or heartbreaking, these letters remind us of the power of human connection in both joy and vulnerability.
  `}
        />
      </Slideshow>
    </LoadingHearts>
  );
}
