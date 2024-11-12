import json

# Path to your JSON file
file_path = '../output.json'

# Open and read the JSON file
with open(file_path, 'r') as file:
    data = json.load(file)

for post in data["post"]:
    print(post) 