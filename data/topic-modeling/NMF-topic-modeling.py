# using scikit learn to do topic modeling 
import json
from sklearn.feature_extraction.text import TfidfVectorizer # num occur in doc / num occur in all docs
from sklearn.decomposition import NMF
from sklearn.feature_extraction.text import CountVectorizer # num occur in doc only 
from sklearn.decomposition import LatentDirichletAllocation # LDA, used for topic modeling 
import matplotlib.pyplot as plt
import numpy as np


# STEP 1: load json file with cleaned root words 
with open("../cleaned-root-words.json", "r") as rootwordsFile:
  rootWords = json.load(rootwordsFile)

post_ids = list(rootWords.keys()) # getting all the post ids for saving later 

# STEP 2: flatten the dictionary and turn it into a document for topic modeling
# documents = ["all the words of letter 1", "all words of letter 2", ...] (array of joined strings)
documents = [" ".join(words) for words in rootWords.values()]
# .value maintains the original order of the letters so each index matches post_ids above 


# STEP 3: turn words into vectors so scikit can figure it out 
# dtm = document-term matrix 
# (col: terms, rows: documents, intersections: count of how many times the word shows up in doc)
vectorizer = TfidfVectorizer()
dtm = vectorizer.fit_transform(documents)
words = vectorizer.get_feature_names_out() # the unique words over all the letters (cols in dtm)

print(f"DTM shape: {dtm.shape}")  # Example: (3, 9) for 3 letters and 9 unique words
print(f"Vocabulary: {words}")

# STEP 4: run LDA 
num_topics = 15
nmf = NMF(n_components=num_topics, random_state=42)
nmf.fit(dtm)
# words = vectorizer.get_feature_names_out() # the unique words over all the letters (cols in dtm)


# STEP 5: extract the top topic for each letter 
# document topic distribution matrix 
# each row is a letter 
# each column is one of the topics NMF discovered 
# each val is strength/weight of topic in letter 
topic_distribution = nmf.transform(dtm)
# print(topic_distribution)

# array of indices with largest topic value for each letter
dominant_topics = np.argmax(topic_distribution, axis=1) 
# print(dominant_topics)

# sorts topic weights in ascending order and gets top two largest 
sorted_topic_indices = np.argsort(topic_distribution, axis=1)
top_two_topic_idx = sorted_topic_indices[:, -2:][:, ::-1]
print("sorted indices")
print(sorted_topic_indices)

# get the weights associated with top two topics
top_two_weights = np.take_along_axis(topic_distribution, top_two_topic_idx, axis=1)

print("Top two topics (indices):")
print(top_two_topic_idx)
print("Top two weights:")
print(top_two_weights)

results = []
for i in range(len(post_ids)):
  result = {
    "post_id": post_ids[i],
    "topics": {
      "first": {"topic": int(top_two_topic_idx[i, 0]), "weight": float(top_two_weights[i, 0])},
      "second": {"topic": int(top_two_topic_idx[i, 1]), "weight": float(top_two_weights[i, 1])}
    },
    "all_weights": topic_distribution[i].tolist()
  }
  results.append(result)

# save results to a file 
with open("../top_topics_with_weights.json", "w") as resultsFile:
    json.dump(results, resultsFile, indent=4)



# STEP 6: SAVING TOPIC INFO --------------------------------------------------------------------
# STEP 6A: Count the number of letters in each topic and print it out (checking distribution)
topic_counts = np.bincount(dominant_topics)  # Count the occurrences of each topic

# STEP 6B : extract the top topics for each letter (top themes from each letter)
topics = []
def extract_topics(model, feature_names, top_words_count=20):
  for topic_idx, topic in enumerate(model.components_):
    print(f"Topic {topic_idx}:")
    top_word_idx = topic.argsort()[-top_words_count:][::-1]  # Sort and get top words
    top_words = [feature_names[i] for i in top_word_idx]  # Match words to indices
    print(" ".join(top_words))
    print()
    topic = {
      "topic": topic_idx, 
      "top_words": top_words,
      "num_letters_assigned": int(topic_counts[topic_idx])
    }
    topics.append(topic)

extract_topics(nmf, words)

# save topics to a file
with open("../topics_NMF_15.json", "w") as topicsFile:
    json.dump(topics, topicsFile, indent=4)

