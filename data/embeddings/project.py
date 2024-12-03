import numpy as np
from matplotlib import pyplot as plt

import generate as gen

FULL_CORPUS_SIZE = 843

class ProjViz:
    """ Class for producing a projection map visualization for the love letters corpus
    """

    def __init__(self, dim=2, n_samples=150):
        """ set a new ProjViz object with a particular dimensionality
        """
        self.M, self.word2ind = gen.get_co_embeddings(dim, n_samples)
        self.axisLabels = None
        self.axis = None
        self.projections = None

    def set_axis(self, word1, word2):
        """ Calculate the vector which will act as the axis for our viz
        """
        v1 = self.M[self.word2ind[word1]]
        v2 = self.M[self.word2ind[word2]]
        self.axisLabels = [word1, word2]
        self.axis = v1 - v2

        return self.axis
    
    def project_words(self, words, save=True):
        """ Project each word in 'arr' onto presetd axis. Must run set_axis before using this method.
            Return: array of values produced by projecting word vectors onto axis
        """
        if self.axis is None:
            raise RuntimeError("Axis is unsetd. Make sure to call set_axis before calling project_words")
        
        proj = np.array([np.dot(self.axis, self.M[self.word2ind[w]]) for w in words])
        
        if save:
            self.projections = proj
            self.saved_words = words
        return proj

    def plot_projections(self):
        words = self.saved_words
        projections = self.projections
        endpoints = self.project_words(self.axisLabels, save=False)
        num_points = len(words)
        for i in range(num_points):
            plt.annotate(words[i], (projections[i], (i+1)/(num_points + 2)))
            plt.annotate(self.axisLabels[0], (endpoints[0], 0.5))
            plt.annotate(self.axisLabels[1], (endpoints[1], 0.5))

        ax = plt.gca()
        ax.set_xlim([min(endpoints), max(endpoints)])
        plt.show()
        

if __name__ == "__main__":
    viz = ProjViz(dim=100, n_samples=FULL_CORPUS_SIZE)
    viz.set_axis("man", "woman")
    viz.project_words(["sorry", "snuggle", "angry", "alcohol", "abused", "abuser", "alone", "anxiety", "calm", "love", "confused", "certain"])
    viz.plot_projections()

    #TODO: Function for finding top words?