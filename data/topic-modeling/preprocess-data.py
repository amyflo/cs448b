import spacy
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English

import re
import json
import contractions
import string

nlp = spacy.load("en_core_web_sm")

def addApostrophes(text):
  return text.replace('\u2018', "'").replace('\u2019', "'")

def expandContractions(text):
   # need to pass in text without unicode (\u2019 need to be changed to ')
  return contractions.fix(text)

# use spaCy tokenizer, lemma, and stop word tools 
def tokenizeAndRemoveStopWords(text):
  # change to lowercase and remove any leading hyphens
  lowercaseText = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower()  # Remove leading hyphen
  doc = nlp(lowercaseText)
  tokens = []
  lemmas = []
  # only add tokens that are not punctuation, spaces, or stop words (and, a ... )
  for token in doc:
    if (not token.is_punct and not token.is_space and not token.is_stop): 
      tokens.append(token.text)
      lemmas.append(token.lemma_)
      
  return tokens, lemmas

# decode unicode and expand contractions 
# return rootwords of relevant words in letter 
def processText(text):
  withApostrophes = addApostrophes(text) # 
  contractionsExpanded = expandContractions(withApostrophes)
  words, rootWords = tokenizeAndRemoveStopWords(contractionsExpanded)
  return rootWords

# open and load data from the posts json file:
postsFilepath = "../output.json"
with open(postsFilepath, "r") as file:
  data = json.load(file)
  posts = data["post"]

# loop through all posts and process the text 
processedPosts = {}
for postId, postData in posts.items():
  body = postData.get("body")
  if (body and not body.startswith("URL:")):
    processedBody = processText(body)
    processedPosts[postId] = processedBody
print("Number of posts without URLs as body text: ", len(processedPosts))

# export to file 
outputFilepath = "../cleaned-root-words.json"
with open(outputFilepath, "w") as outputFile:
  json.dump(processedPosts, outputFile, indent=4)