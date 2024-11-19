# using scikit learn to do topic modeling 
import json
from sklearn.feature_extraction.text import TfidfVectorizer # num occur in doc / num occur in all docs
from sklearn.feature_extraction.text import CountVectorizer # num occur in doc only 
from sklearn.decomposition import LatentDirichletAllocation # LDA, used for topic modeling 
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
# vectorizer = TfidfVectorizer()
vectorizer = CountVectorizer()
dtm = vectorizer.fit_transform(documents)
words = vectorizer.get_feature_names_out() # the unique words over all the letters (cols in dtm)

print(f"DTM shape: {dtm.shape}")  # Example: (3, 9) for 3 letters and 9 unique words
print(f"Vocabulary: {words}")


# STEP 4: run LDA 
num_topics = 20
lda = LatentDirichletAllocation(n_components=num_topics, random_state=42, max_iter=200)
lda.fit(dtm)

# STEP 5: extract the top topics for each letter (top themes from each letter)
def extract_topics(model, featureNames, topWordsCt): 
  for topicIdx, topic in enumerate(model.components_):
    print(f"Topic {topicIdx}:")
    print(" ".join([featureNames[i] for i in topic.argsort()[:-topWordsCt - 1:-1]]))

extract_topics(lda, words, topWordsCt=20)
