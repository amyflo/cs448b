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

# STEP 2: flatten the dictionary and turn it into a document for topic modeling
# documents = ["all the words of letter 1", "all words of letter 2", ...] (array of joined strings)
documents = [" ".join(words) for words in rootWords.values()]
# print(documents)

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

# STEP 5: extract the top topics for each letter (top themes from each letter)
def extract_topics(model, feature_names, top_words_count=20):
  for topic_idx, topic in enumerate(model.components_):
    print(f"Topic {topic_idx}:")
    top_word_idx = topic.argsort()[-top_words_count:][::-1]  # Sort and get top words
    top_words = [feature_names[i] for i in top_word_idx]  # Match words to indices
    print(" ".join(top_words))
    print()

extract_topics(nmf, words)

# STEP 6: extract the top topic for each letter 
topic_distribution = nmf.transform(dtm)
dominant_topics = np.argmax(topic_distribution, axis=1)

# STEP 7: print top topic for each letter (identify the letters in each cluster)
# for i, topic in enumerate(dominant_topics):
#     print(f"Letter {i+1} is assigned to Topic {topic}")

# STEP 8: Count the number of letters in each topic and print it out (checking distribution)
topic_counts = np.bincount(dominant_topics)  # Count the occurrences of each topic
for topic_num, count in enumerate(topic_counts):
    print(f"Topic {topic_num}: {count} letters")
