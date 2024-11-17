import spacy
from spacy.tokenizer import Tokenizer
from spacy.lang.en import English

import re
import json
import contractions
import string

# example test text 
example = "I haven\u2019t bothered to want to impress anybody. I\u2019m always the strong looking one.\n\nHow to show you my soft side?\n\nNot the overdone clubbing Y2K -chic hollywood -holiday party side, the metal girl, the not giving 2 fucks i\u2019ll wear the clothes I slept in all day and shower tomorrow lazy bum of a girl, the single mom look, but a woman who is deserving of your attention?\n\nMy OCD is set on you and all I do today.\n\nHopefully you will get to see all side and still see me in the way I hope you do in your thoughts. \n\nI want 1 date night every other week. No kids - Just us as we are today.\n\nDeal?"

# processing tools
# nlp = English()
nlp = spacy.load("en_core_web_sm")
# tokenizer = Tokenizer(nlp.vocab)


def addApostrophes(text):
  return text.replace('\u2018', "'").replace('\u2019', "'")

def expandContractions(text):
   # need to pass in text without unicode (\u2019 need to be changed to ')
  return contractions.fix(text)

# use spaCy tokenizer and lemma tools 
# splits letter into individual words 
# also finds the root form of each word
def tokenize(text):
  # lowercaseText = text.lower()
  lowercaseText = re.sub(r'[^a-zA-Z0-9\s]', '', text).lower()  # Remove leading hyphen

  doc = nlp(lowercaseText)
  tokens = []
  lemmas = []
  for token in doc:
    if (not token.is_punct and not token.is_space): 
      tokens.append(token.text)
      lemmas.append(token.lemma_)
      
  return tokens, lemmas

# decode the unicode --> changing "haven\u2019t" to haven't for contraction expansion
def processText(text):
  withApostrophes = addApostrophes(text)
  contractionsExpanded = expandContractions(withApostrophes)
  words, rootWords = tokenize(contractionsExpanded)

  print("ORIGINAL WORDS: ", words)
  print("-------------")
  print("ROOT WORDS: ", rootWords)
  # return processedText

processed = processText(example)
# print("Processed Text:", processed)