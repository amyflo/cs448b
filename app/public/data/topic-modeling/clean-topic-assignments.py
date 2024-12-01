import json 

# import the topic assignments file (the old cluttered one) 
with open("./results/top_topics_with_weights.json", "r") as assignmentsFile:
  topicAssignments = json.load(assignmentsFile)
# print(topicAssignments)

# import the topic ref file (will use to get all the text labels from it)
with open("./results/topics_NMF_15.json", "r") as topicsRefFile:
  topicsRef = json.load(topicsRefFile)
# print(topicsRef)

# create json structure for cleaned topic assignments
assignmentsDict = {}
for post in topicAssignments:
  postIdx = post["topics"]["first"]["topic"]
  postInfo = {
    "idx": postIdx,
    "label": topicsRef[postIdx]["label"]
  }
  assignmentsDict[post["post_id"]] = postInfo
print(assignmentsDict)
print("number of total letters in dictionary: ", len(assignmentsDict))

# export to ./results/final-topic-assignments.json
with open("./results/final-topic-assignments.json", "w") as cleanedAssignmentsFile:
  json.dump(assignmentsDict, cleanedAssignmentsFile, indent=4)