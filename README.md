# cs448b

## Preprocessing Love Letter Text for Topic Modeling + Word Embeddings

### Steps:

1. **Expand Contractions**

   - Converts words like `"haven't"` → `"have not"`.
   - **Library:** `contractions`

2. **Lowercase Conversion**

   - Coverts all words to lower case so `"love"` and `"Love"` would count as the same.
   - **Library:** Python built-in string methods.

3. **Remove Punctuation**

   - Removes punctuation and special characters since we only care about the words
   - **Library:** Python's `string` module.

4. **Tokenization**

   - Split text in letter into individual words so we can iterate through.
   - **Library:** `spacy`

5. **Remove Stop Words**

   - Filters out common stop words like "and," "the," and "is."
   - **Library:** `spacy`

6. **Lemmatization**

   - Converts words to their base/root form like `"running"` → `"run"`.
   - **Library:** `spacy`

7. **Save Cleaned Data**
   - Outputs the cleaned text to an array of JSON objects where each object is:
     `{post_id(string): [array, of, words,...]}`
   - Outputs a bag of words with duplicates

---

## Setup Instructions

### Install Required Libraries

Use `pip` to install the necessary Python packages:

```bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
