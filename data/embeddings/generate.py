import sys
assert sys.version_info[0] == 3
assert sys.version_info[1] >= 8

from gensim.models import KeyedVectors
from gensim.test.utils import datapath
import pprint
import matplotlib.pyplot as plt
plt.rcParams['figure.figsize'] = [10, 5]

import json
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))
love_letters_dataset = []
with open(dir_path + "/../../app/public/data/consolidated_posts.json", "r") as f:
    love_letters_dataset = json.load(f)

import re
import numpy as np
import random
import scipy as sp
from sklearn.decomposition import TruncatedSVD
from sklearn.decomposition import PCA

import argparse
parser = argparse.ArgumentParser()

START_TOKEN = '<START>'
END_TOKEN = '<END>'
NUM_SAMPLES = 150
FULL_CORPUS_SIZE = 843

default_corpus_fname = dir_path + "/samples-love_letters_corpus.json"
default_dict_fname = dir_path + "/samples-word2ind.json"
default_matrix_fname = dir_path + "/samples-co-occurrence_matrix.npy" 

np.random.seed(0)
random.seed(0)

# ------------------------------------------
# Data Handling 
# ------------------------------------------

def read_corpus(n_samples=NUM_SAMPLES, corpus_fname = default_corpus_fname):
    """ Read files from Love Letters dataset
        Return:
            list of lists, with words from each of the processed files
    """
    
    if os.path.exists(corpus_fname):
        print("Loading corpus from", corpus_fname)
        with open(corpus_fname, "r") as f:
            corpus = json.load(f)
    else:
        print("reading corpus")
        # get a list of the first NUM_SAMPLES objects in the love letters dataset
        files = list(love_letters_dataset['post'].values())[:n_samples]
        # extract the title and the body from our list of objects.
        # Then perform data cleaning: add start and end tags, convert words to lowercase
        corpus = [[START_TOKEN] + [re.sub(r'[^\w]', '', w.lower()) for w in (f['title'] + " " + f['body']).split(" ")] + [END_TOKEN] for f in files]

        with open(corpus_fname, "w") as f:
            print("Saving corpus to", corpus_fname)
            json.dump(corpus, f)
        
    return corpus

def distinct_words(corpus):
    """ Determine a list of distinct words for the corpus.
        Params:
            corpus (list of list of strings): corpus of documents
        Return:
            corpus_words (list of strings): sorted list of distinct words across the corpus
            n_corpus_words (integer): number of distinct words across the corpus
    """
    corpus_words = []
    n_corpus_words = -1

    # flatten our corpus from a list of lists into a set
    # this simultaneously reduces the dimensionality to 1 and removes duplicate words
    corpus_words = {y for x in corpus for y in x}
    # count the number of distinct words
    n_corpus_words = len(corpus_words)
    # convert the set of distinct words into a list so it can be sorted
    corpus_words = list(corpus_words)
    corpus_words.sort()

    return corpus_words, n_corpus_words

# -------------------------------
# Produce co-occurence embeddings
# -------------------------------

def compute_co_occurrence_matrix(corpus, window_size=4, dict_fname=default_dict_fname, matrix_fname=default_matrix_fname):
    """ Compute co-occurrence matrix for the given corpus and window_size (default of 4).
    
        Note: Each word in a document should be at the center of a window. Words near edges will have a smaller
              number of co-occurring words.
              
              For example, if we take the document "<START> All that glitters is not gold <END>" with window size of 4,
              "All" will co-occur with "<START>", "that", "glitters", "is", and "not".
    
        Params:
            corpus (list of list of strings): corpus of documents
            window_size (int): size of context window
        Return:
            M (a symmetric numpy matrix of shape (number of unique words in the corpus , number of unique words in the corpus)): 
                Co-occurence matrix of word counts. 
                The ordering of the words in the rows/columns should be the same as the ordering of the words given by the distinct_words function.
            word2ind (dict): dictionary that maps word to index (i.e. row/column number) for matrix M.
    """
    if os.path.exists(dict_fname) and os.path.exists(matrix_fname):
        print("Loading word2ind dict from", dict_fname)
        with open(dict_fname, "r") as f:
            word2ind = json.load(f)        

        print("Loading co-occurrence matrix from", matrix_fname)
        M = np.load(matrix_fname)
    else:
        print("computing co-occurence matrix")

        words, n_words = distinct_words(corpus)
        M = None
        word2ind = {}
        
        # map words to their position in the list of distinct words
        # this will be used later to assign indeces in the matrix M
        word2ind = {words[i]:i for i in range(n_words)}

        # create empty 2-d array of size n_words * n_words
        M = np.zeros((n_words, n_words))
        
        # itereate over each review in the corpus
        for review in corpus:
        # iterate over each word in the review
            for word_idx in range(len(review)):
                # calculate indices of the window
                min_index = 0 if word_idx - window_size < 0 else word_idx - window_size
                max_index = len(review) - 1 if word_idx + window_size > len(review) - 1 else word_idx + window_size
                
                # for each word in the window, count its co-occurence with the center word
                for window_word in review[min_index:word_idx]:
                    M[word2ind[review[word_idx]], word2ind[window_word]] += 1
                for window_word in review[word_idx + 1: max_index + 1]:
                    M[word2ind[review[word_idx]], word2ind[window_word]] += 1

        with open(dict_fname, "w") as f:
            print("Saving word2ind dict to", dict_fname)
            json.dump(word2ind, f)
        print("Saving co-occurrence matrix to", matrix_fname)
        np.save(matrix_fname, M)
    return M, word2ind

def reduce_to_k_dim(M, k=2):
    """ Reduce a co-occurence count matrix of dimensionality (num_corpus_words, num_corpus_words)
        to a matrix of dimensionality (num_corpus_words, k) using the following SVD function from Scikit-Learn:
            - http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.TruncatedSVD.html
    
        Params:
            M (numpy matrix of shape (number of unique words in the corpus , number of unique words in the corpus)): co-occurence matrix of word counts
            k (int): embedding size of each word after dimension reduction
        Return:
            M_reduced (numpy matrix of shape (number of corpus words, k)): matrix of k-dimensioal word embeddings.
                    In terms of the SVD from math class, this actually returns U * S
    """    
    print("performing dimensionality reduction")
    n_iters = 10    # Use this parameter in your call to `TruncatedSVD`
    M_reduced = None
    print("Running Truncated SVD over %i words..." % (M.shape[0]))
    
   # create scikitlearn Truncated SVD object to reduce M to k dimensions
    svd = TruncatedSVD(n_components=k, n_iter=n_iters)
    # perform dimensionality reduction using SVD
    M_reduced = svd.fit_transform(M)

    print("Done.")
    return M_reduced


# --------------------------
# Producing GloVe embeddings
# --------------------------

def load_embedding_model():
    """ Load GloVe Vectors
        Return:
            wv_from_bin: All 400000 embeddings, each length 200
    """
    print("load GloVe model")
    import gensim.downloader as api
    wv_from_bin = api.load("glove-wiki-gigaword-200")
    print("Loaded vocab size %i" % len(list(wv_from_bin.index_to_key)))
    return wv_from_bin

def get_matrix_of_vectors(wv_from_bin, required_words):
    """ Put the GloVe vectors into a matrix M.
        Param:
            wv_from_bin: KeyedVectors object; the 400000 GloVe vectors loaded from file
        Return:
            M: numpy matrix shape (num words, 200) containing the vectors
            word2ind: dictionary mapping each word to its row number in M
    """
    import random
    words = list(wv_from_bin.index_to_key)
    print("Shuffling words ...")
    random.seed(225)
    random.shuffle(words)
    print("Putting %i words into word2ind and matrix M..." % len(words))
    word2ind = {}
    M = []
    curInd = 0
    for w in words:
        try:
            M.append(wv_from_bin.get_vector(w))
            word2ind[w] = curInd
            curInd += 1
        except KeyError:
            continue
    for w in required_words:
        if w in words:
            continue
        try:
            M.append(wv_from_bin.get_vector(w))
            word2ind[w] = curInd
            curInd += 1
        except KeyError:
            continue
    M = np.stack(M)
    print("Done.")
    return M, word2ind

# -------------------
# Plotting embeddings
# -------------------

def plot_embeddings(M_reduced, word2ind, words):
    """ Plot in a scatterplot the embeddings of the words specified in the list "words".
        NOTE: do not plot all the words listed in M_reduced / word2ind.
        Include a label next to each point.
        
        Params:
            M_reduced (numpy matrix of shape (number of unique words in the corpus , 2)): matrix of 2-dimensioal word embeddings
            word2ind (dict): dictionary that maps word to indices for matrix M
            words (list of strings): words whose embeddings we want to visualize
    """

    # iterate over 'words' and plot each
    for i,word in enumerate(words):
        x = M_reduced[word2ind[word], 0]
        y = M_reduced[word2ind[word], 1]
        plt.scatter(x, y, marker='x', color='red')
        plt.text(x, y, word, fontsize=9)
    plt.show()

def get_co_embeddings(dim=2, n_samples=NUM_SAMPLES):
    """ Produce a co-occurrence matrix from the love letters dataset
        
        Params:
            dim (integer): the desired dimsnionality of the word vectors. Default is 2, useful for visualization. For more robust analysis, 100 is recommended.

        Returns:
            M (n_words x dim matrix): Matrix of word vectors normalized to unit length
            word2ind (dict): dictionary mapping words to rows in the matrix.

    """
    corpus_fname = dir_path + f"/{n_samples}_samples-love_letters_corpus.json"
    dict_fname = dir_path + f"/{n_samples}_samples-word2ind.json"
    matrix_fname = dir_path + f"/{n_samples}_samples-co-occurrence_matrix.npy" 

    love_letters_corpus = read_corpus(n_samples, corpus_fname)
    M_co_occurrence, word2ind_co_occurrence = compute_co_occurrence_matrix(love_letters_corpus, 
                                                                           dict_fname=dict_fname, 
                                                                           matrix_fname=matrix_fname)
    M_reduced_co_occurrence = reduce_to_k_dim(M_co_occurrence, k=dim)

    # Rescale (normalize) the rows to make them each of unit-length
    M_lengths = np.linalg.norm(M_reduced_co_occurrence, axis=1)
    M_normalized = M_reduced_co_occurrence / M_lengths[:, np.newaxis] # broadcasting
    return M_normalized, word2ind_co_occurrence

def save_toJSON(filename, word2ind, M):
    with open(filename, "w") as f:
            print("Saving embeddings to", filename)
            embeddings = {}
            for w in word2ind.keys():
                embeddings[w] = M[word2ind[w]].tolist()
            json.dump(embeddings, f)

# --------------------
# Visualize embeddings
# --------------------

if __name__ == "__main__":
    parser.add_argument("-m", "--model", help="Specify which model to use to generate embeddings", 
                    type=str, choices=["glove", "co-occurrence", "both"], default="co-occurrence")
    parser.add_argument("-t", "--test", action="store_true")
    parser.add_argument("-s", "--saveJSON", action="store_true")
    parser.add_argument("-f", "--filename", type=str)
    parser.add_argument("-d", "--dim", type=int, default=2)
    parser.add_argument("-n", "--num_samples", type=int, default=FULL_CORPUS_SIZE)
    args = parser.parse_args()

    if(args.test):
        test_words = ['movie', 'book', 'love', 'story', 'hate', 'good', 'interesting', 'sorry', 'silly', 'bad']
        print("Test generate embeddings")
        print("Will plot the following words:", test_words)

    ### Generate embeddings from co-occurrence model ###
    if(args.model == "co-occurrence" or args.model == "both"):
        love_letters_corpus = read_corpus(n_samples=args.num_samples)
        M_co_occurrence, word2ind_co_occurrence = compute_co_occurrence_matrix(love_letters_corpus)
        M_reduced_co_occurrence = reduce_to_k_dim(M_co_occurrence, k=args.dim)

        # Rescale (normalize) the rows to make them each of unit-length
        M_lengths = np.linalg.norm(M_reduced_co_occurrence, axis=1)
        M_normalized = M_reduced_co_occurrence / M_lengths[:, np.newaxis] # broadcasting

        if args.saveJSON:
            save_toJSON(args.filename, word2ind_co_occurrence, M_normalized)

        if args.test:
            # plot co-occurence embeddings
            print("Co-occurrence embeddings. Close to continue . . .")
            plot_embeddings(M_normalized, word2ind_co_occurrence, test_words)


    if(args.model == "glove" or args.model == "both"):
        ### Generate GloVe Embeddings ###
        wv_from_bin = load_embedding_model()
        glove_M, glove_word2ind = get_matrix_of_vectors(wv_from_bin, test_words)
        glove_M_reduced = reduce_to_k_dim(glove_M, k=2)

        # Rescale (normalize) the rows to make them each of unit-length
        glove_M_lengths = np.linalg.norm(glove_M_reduced, axis=1)
        glove_M_reduced_normalized = glove_M_reduced / glove_M_lengths[:, np.newaxis] # broadcasting

        # plot glove emeddings
        print("GloVe embeddings. Close to continue . . .")
        plot_embeddings(glove_M_reduced_normalized, glove_word2ind, test_words)
