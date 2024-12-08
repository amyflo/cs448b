"use client";

import React from "react";
import Card from "../components/ui/about-card";
import Navbar from "../components/ui/nav";

export default function Home() {
  return (
    <>
      <Navbar />
      <Card
        title="About the Project"
        description={`This project was created as part of the Fall 2024 CS448B: Data Visualization course final project at Stanford University by Amy Lo, Ellie Vela, and Caroline Tran. [See the code for this project on GitHub](https://github.com/amyflo/cs448b). None of this would have been possible without a sweet treat every once in a while and a fondness for love letters. We love love, what can we say?`}
      />
      <Card
        title="About r/LoveLetters"
        description={`With 9.4k members as of November 2024, r/LoveLetters has grown into an engaging and active community, ranking in the top 7% of subreddits by size. The subreddit is dedicated to sharing heartfelt, anonymous love letters and romantic confessions. Its growth is supported by careful moderation, where users are required to submit posts for approval to ensure that the content aligns with the subreddit’s theme of romantic expression and positivity. Learn more about [subreddit rankings and growth](https://subredditstats.com/) and explore the [Reddit Wiki](https://www.reddit.com/wiki) for guidelines on moderation.`}
      />
      <Card
        title="About our dataset"
        description={`For our analysis, we scraped data from the r/LoveLetters subreddit spanning **April 2021 to November 2024**, resulting in a dataset of 843 posts and their associated comments. Due to [Reddit API scraping limits](https://www.reddit.com/dev/api/), the timeframe constrained the scope of our dataset. We carefully collected posts and comments and organized them into JSON files grouped by unique post IDs and comment IDs. This structured dataset enabled efficient association between posts and their corresponding comments, making it suitable for sentiment and topic analysis. `}
      />
      <Card
        title="Data Cleaning and Sentiment Analysis"
        description={`After cleaning the data, we used the [Sentiment.js](https://github.com/thisandagain/sentiment) library to analyze the sentiment of each post and comment, providing insights into the emotional tone of the content. Our data cleaning process involved normalizing the text by converting it to lowercase to avoid duplicate counts, tokenizing the text into individual words or tokens for analysis, converting words to their root forms (stemming/lemmatization) to better scale the number of unique words, and removing common stop words (e.g., "the," "and," "is") using a [stopword library](https://github.com/fergiemcdowall/stopword) to focus on meaningful content.
  `}
      />

      <Card
        title="Topic Modeling and Word Analysis"
        description={`To identify key topics of each letter, we used the [Term Frequency-Inverse Document Frequency (TF-IDF)](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html) vectorizer, which assigns weights to terms based on their frequency in a single document compared to the entire corpus. 

We then applied a topic modeling method called [Non-Negative Matrix Factorization (NMF)](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.NMF.html) after preprocessing steps like tokenization and stop word removal. NMF grouped letters with similar terms, enabling us to determine 15 topics, such as "Idealistic Soulmates" and "Empathy, Forgiveness, and Apology."

Finally, we explored word relationships and patterns using a [word embedding model](https://radimrehurek.com/gensim/models/word2vec.html) combined with [Principal Component Analysis (PCA)](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html), uncovering connections between frequently used words and overarching themes.`}
      />
    </>
  );
}
