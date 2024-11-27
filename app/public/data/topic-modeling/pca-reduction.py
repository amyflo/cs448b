import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
import json

topicAssignmentData = pd.read_json("../top_topics_with_weights.json")
# print(topicAssignmentData)

allTopicWeights = np.array(topicAssignmentData["all_weights"].tolist())
# print(allTopicWeights)

# get the first two principal components with PCA 
pca = PCA(n_components=2)
reducedData = pca.fit_transform(allTopicWeights)

print(reducedData)

# # format the data as array of objects 
reductedObj = []
for point in reducedData:
  reductedObj.append({
    "x": point[0],
    "y": point[1]
  })

print(reductedObj)
# # export data as json 
with open("./results/reduced-data.json", "w") as reducedFile:
  json.dump(reductedObj, reducedFile)