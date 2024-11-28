import pandas as pd
import numpy as np
from sklearn.manifold import TSNE
import json

topicAssignmentData = pd.read_json("./results/top_topics_with_weights.json")
# print(topicAssignmentData)

allTopicWeights = np.array(topicAssignmentData["all_weights"].tolist())
# print(allTopicWeights)

# get the components using tsne 
tsne = TSNE(n_components=2)
reducedData = tsne.fit_transform(allTopicWeights)

print(reducedData)

# format the data as array of objects 
reductedObj = []
for point in reducedData:
  reductedObj.append({
    "x": float(point[0]),
    "y": float(point[1])
  })

print(reductedObj)
# export data as json 
with open("./results/tsne-reduced-data.json", "w") as reducedFile:
  json.dump(reductedObj, reducedFile)