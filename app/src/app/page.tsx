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
import Navbar from "./components/ui/nav";
import TopicAnalyzer from "./components/visualizations/p2/bubble-chart";

export default function Home() {
  return (
    <LoadingHearts>
      <Navbar />
      <Slideshow>
        <Hero />

        {/* ********************************* POSTING CARDS START HERE ********************************* */}
        <TransitionScreen
          title="How Has r/LoveLetters Grown and Changed Over Time?"
          description="Tracking the growth and changes in posting patterns over time."
        />

        <Card
          title="Slow start, rapid rise"
          howToUse="This chart visualizes the total posts in r/LoveLetters over the given time period. Hover over a point to see the month, the number of posts for that month, and the cumulative total of posts up to that point."
          howItWasCreated="This chart aggregates the number of posts per month by processing data scraped from the r/LoveLetters subreddit. The dataset includes timestamps for each post, which were grouped into monthly intervals to create the visualization."
          description={`With 9.4k members as of November 2024, it ranks in the top 7% of subreddits by size. The community is moderated, requiring users to submit posts for approval to ensure content aligns with the subreddit’s focus. 
            
From **April 2021 to December 2022**, posting frequency grew steadily, punctuated by occasional spikes likely tied to significant events or community-driven discussions. 

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
          title="Pause and Revival"
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
          title="Explore the r/LoveLetters timeline"
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
          title="How does sentiment shape the love letters in r/LoveLetters?"
          description="A closer look at the distribution of positive, neutral, and negative sentiments"
        />

        <Card
          title="Positive sentiment dominates love letters in r/LoveLetters."
          howToUse="This chart displays the number of posts classified as positive, neutral, or negative. The bars represent the sentiment categories."
          howItWasCreated="The chart was generated leveraging sentiment scores from a JSON dataset analysed using Sentiment.js. The bars are color-coded to represent sentiment polarity, with animations triggered when the chart is rendered. Negative posts are have a sentiment score less than zero, while positive posts have a sentiment score greater than zero."
          description={`Sentiment analysis was used to quantify the emotional tone of posts in r/LoveLetters. Numerical scores were assigned based on a predefined lexicon, where positive words like "love" or "happy" received positive scores, and negative words like "regret" or "sad" received negative scores. Context was considered to improve accuracy, and the magnitude of each score reflects the intensity of the emotion expressed.

The analysis reveals that **68% (571 posts) express positive sentiment**, while **20% (170 posts) exhibit negative sentiment**. This highlights the dual purpose of r/LoveLetters: a space for celebrating joy and hope, as well as for processing pain and grief. The positive skew of the posts may be due to the subreddit’s focus on love and gratitude, moderation policies that encourage uplifting content, or the natural tendency of users to share positive experiences more openly.`}
        >
          <SentimentPosts />
        </Card>
        <Card
          title="Longer love letters exhibit a greater range in emotional intensity than shorter ones."
          howItWasCreated="We used Sentiment.js to calculate sentiment scores for each post, or love letter, in the dataset. Sentiment.js assigns a numerical score based on the presence of positive and negative words in the text. Posts with higher positive scores reflect stronger positive sentiment, while negative scores indicate negative sentiment. To better visualize the relationship between word count and sentiment, we plotted word counts on a logarithmic scale, as lengths varied widely across posts. This scaling allowed for a clearer comparison by reducing the impact of outliers and emphasizing patterns in the data."
          howToUse="This scatterplot shows sentiment scores on the y-axis and word counts on the x-axis. Each dot represents a post, with its color indicating its sentiment (positive, neutral, or negative). A dotted line at y=0 marks neutral sentiment. Hover over a dot to view its title, date, sentiment score, and word count, and click on a dot to see detailed information about the post in the details panel."
          description={`Longer posts tend to express greater emotional intensity, with extremes in both positive and negative sentiment. Shorter posts, on the other hand, often cluster near neutrality, possibly due to limited narrative depth.

This observation suggests that longer narratives allow for more nuanced and varied emotional expression.`}
        >
          <Length />
        </Card>

        <Card
          title="Sentiment of love letters has shifted positively over time."
          howItWasCreated="We used Sentiment.js to calculate sentiment scores for each post in the dataset. Sentiment.js assigns a numerical score based on the presence of positive and negative words in the text. Posts with higher positive scores reflect stronger positive sentiment, while negative scores indicate negative sentiment."
          howToUse="This scatterplot shows sentiment scores on the y-axis and the months on the x-axis. Each dot represents a post, with its color indicating its sentiment (positive, neutral, or negative). A dotted line at y=0 marks neutral sentiment. Hover over a dot to view its title, date and sentiment score, and click on a dot to see detailed information about the post in the details panel."
          description={`Zooming in on November 2021 to June 2023 before r/Loveletters was temporarily closed, we see that sentiment trends reveal that positivity (red) has become increasingly dominant over time. This skew towards positivity reflects both the subreddit’s moderation policies and its focus on uplifting, heartfelt content. However, the presence of negative sentiment—particularly in posts about heartbreak or regret—reveals that vulnerability is equally welcome.`}
        >
          <Sentiment2OverTime />
        </Card>

        {/* ********************************* Language modelling CARDS START HERE ********************************* */}
        <TransitionScreen
          title="What can the connections between words in love letters reveal?"
          description="Exploring language patterns sheds light on societal influences, emotional tones, and the deeper meanings behind love letters."
        />
        <Card
          title="Letters with gendered language tend to be written from the perspective of straight women."
          howItWasCreated="TODO"
          howToUse="TODO"
          description='First and second person pronouns tend to be used near the word "girl". We also see "that" and "other" more closely associated with "girl", indicating that authors of our love letters tend to see other women as romantic rivals. On the other hand, "dream" is more closely related to "boy", indicating that love letter authors are writing about men."'
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
        <Card
          title="TODO"
          description="TODO"
          howItWasCreated="TODO"
          howToUse="TODO"
        >
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
        <Card
          title="TODO"
          description="TODO"
          howItWasCreated="TODO"
          howToUse="TODO"
        >
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
        <Card
          title="TODO"
          description="TODO"
          howItWasCreated="TODO"
          howToUse="TODO"
        >
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
        <Card
          title="TODO"
          description="TODO"
          howItWasCreated="TODO"
          howToUse="TODO"
        >
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
          title="What topics emerge across love letters shared in r/LoveLetters?"
          description="Through analysis of love letters, we discovered themes surfaced that reveal the many ways people express emotions, relationships, and personal experiences."
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
          howToUse="This visualization provides a comprehensive look at the relationships between topics, sentiment scores, average word counts, and the number of posts in r/LoveLetters. Each bubble represents a topic, with its size indicating the average sentiment score, its color representing the topic category, its horizontal position showing the number of posts, and its vertical position showing the average word count. You can explore this chart by hovering over the bubbles to reveal detailed information about each topic, including the average sentiment score, average word count, and total number of posts. Observing the positioning of the bubbles allows you to understand how frequently topics are discussed and whether the love letters tend to be brief or detailed. Larger bubbles represent topics with higher sentiment scores, indicating a more positive tone in the posts, while smaller bubbles suggest more neutral sentiments."
          howItWasCreated="The data was analyzed by grouping posts into thematic categories. For each theme, average sentiment scores, word counts, and total post counts were calculated. A bubble chart was generated, mapping the number of posts on the x-axis, average word count on the y-axis, topic as the bubble color, and sentiment score as the bubble size."
          title="Analyzing Themes in r/LoveLetters"
          description={`Generally, topics with more posts tend to have higher average word counts. Topics with more posts and higher word counts may reflect themes that elicit more emotional engagement. Users may feel compelled to contribute longer and richer content on such topics. However, notable exceptions include **Serenity and Beauty** and **Idealistic Soulmates,** which have a moderate word count but a large number of posts. This suggests these topics resonate widely but don’t necessarily require lengthy expressions. 
    
Sentiment scores across topics are generally positive, with **Playful Longing** standing out with a score of 0.17, closer to neutral. This indicates some diversity in emotional tone, but the overall sentiment suggests a positive outlook in the subreddit. 
    
Topics such as **Family Dynamics** and **Playful Longing** with lower average word counts and fewer posts cluster in the lower-right quadrant. These topics may involve quicker, more casual expressions of sentiment, whereas topics with longer posts, like "Reflection on Life Journey," may reflect deeper or more detailed discussions.
  `}
        >
          <TopicAnalyzer />
        </Card>

        <Card
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Select topics on the legend to filter the datapoints by theme. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          title="Letters aligned with language from multiple personas and emotional states."
          description={`Letters did not strictly cluster into a single primary topic but instead displayed **overlapping associations** with other topics. These letters often reflected multiple *personas* and *emotional states*, such as the **'wishful thinker'** or the **'romantic idealist'**. Nodes positioned near those from different topics represent letters sharing **similar word usage**, indicating that **multiple themes** were often prominent.

Wishful thinkers frequently use metaphors that align with the word-usage in the topic **Serenity and Beauty**. Some letters from **Idealistic Soulmates** also closely align with the word-usage in **Vulnerability and Heartbreak**.

This highlights how vulnerable emotional states can inspire language similar to that of a wishful thinker.
`}
        >
          <TopicVisualization
            id="tsne138"
            key="tsne138"
            title="Title of visualization"
            editable={false}
            activeTopics={new Set([1, 3, 8])}
          />
        </Card>

        <Card
          title="Letters could be divided into different themes within the same topic."
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          description={`Letters within the same topic can be divided due to strong associations with other topics. The distinct language and tone of the author create variations within the primary topic, revealing **how different personas can emerge from the same theme.** For example, in the 'Idealistic Soulmates' topic, **we observe two contrasting personas**: one that expresses playful physical longing, and another that portrays a more serious, reflective tone. Letters from Idealistic Soulmates are divided between **Playful Flirtation** and **Reflection on Life Journey**.

The letters from Idealistic Soulmates are influenced by two main themes, which show a split within the topic itself.

**Playful Flirtation**: Half of the letters express physical and sexual longing using casual language, similar to the tone found in Playful Flirtation letters.
**Reflection on Life Journey**: The other half reflect on the past or dream about the future, using deeper language reminiscent of letters that focus on life journeys.

`}
        >
          <TopicVisualization
            id="tsne146"
            key="tsne146"
            editable={false}
            title="Title of visualization"
            activeTopics={new Set([1, 4, 6])}
          />
        </Card>
        <Card
          howToUse="This chart visualizes how letters in r/LoveLetters are distributed across 15 primary themes, filtered by the selected topics in the legend. Hover over each letter datapoint to see the assigned topic and the letter title. Click on that point to see the original post and the 15 topic weight assignments for that letter."
          howItWasCreated="Each letter was transformed into a 15-element vector using topic modeling with NMF, where each value represents the letter's alignment with a specific topic. These vectors were then reduced to two dimensions and plotted on this chart, positioning similar letters closer together to reveal thematic relationships."
          title="Letters related to time also touched on vulnerability as they reflected on the past or dreamed of the future."
          description={`Letters on **Vulnerability and Heartbreak** share language with letters from **Reflections on Moments of Time**. These letters, reflecting on the past and future, are closely linked to themes of vulnerability and heartbreak. 
        
        
Authors often **compare their present selves to their past**, reminiscing about previous experiences and **envisioning missed opportunities** or irreversible moments. They also **dream or wonder about the future**, imagining how things might have been different. In their most vulnerable moments, these authors revisit past memories or imagine future possibilities, contemplating what could have been.`}
        >
          <TopicVisualization
            id="tsne08"
            key="tsne08"
            title="Title of Visualization"
            activeTopics={new Set([0, 8])}
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
          description={`The analysis of r/LoveLetters highlights its growth as a space for emotional expression and connection. Posting trends show steady growth from its inception, with notable spikes around culturally significant times such as Valentine’s Day, suggesting the community serves as an outlet for reflection during moments tied to love and relationships. 

Sentiment analysis reveals a predominantly positive tone across posts (68%). **Longer posts tend to express greater emotional intensity**, including extremes in both positive and negative sentiment, while shorter letters often cluster near neutrality, reflecting limited narrative depth. 

Word associations within the letters **reveal underlying societal dynamics**, such as gendered perspectives, and provide insight into how language captures the complexity of relationships and emotions.  

Thematic analysis uncovers a wide range of topics, from reflections on life journeys and idealistic soulmates to playful longing and hopeful goodbyes. While topics with more posts generally tend to have longer word counts, exceptions like **“Serenity and Beauty”** and **“Idealistic Soulmates”** resonate widely without requiring lengthy expressions. 

Together, these findings illustrate the ways love is expressed in r/LoveLetters while reflecting the deeply personal and shared nature of relationships in an online community.  
`}
        />
      </Slideshow>
    </LoadingHearts>
  );
}
