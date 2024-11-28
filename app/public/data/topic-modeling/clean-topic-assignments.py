import json 

# import the old file 
with open("./results/top_topics_with_weights.json", "r") as assignmentsFile:
  topicAssignments = json.load(assignmentsFile)
# print(topicAssignments)

# create json structure 
assignmentsDict = {}
for post in topicAssignments:
  assignmentsDict[post["post_id"]] = post["topics"]["first"]["topic"]
print(assignmentsDict)
print("number of total letters in dictionary: ", len(assignmentsDict))

# export to ./results/final-topic-assignments.json
with open("./results/final-topic-assignments.json", "w") as cleanedAssignmentsFile:
  json.dump(assignmentsDict, cleanedAssignmentsFile, indent=4)