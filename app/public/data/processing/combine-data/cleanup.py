import json
from collections import defaultdict

# Function to merge data by ID with conflict resolution
def merge_posts(files, conflict_strategy="overwrite"):
    consolidated_data = defaultdict(dict)

    for file in files:
        with open(file, 'r') as f:
            data = json.load(f)
   
            for post_id, post_data in data.items():
                if post_id not in consolidated_data:
                    consolidated_data[post_id] = post_data
                else:
                    # Handle conflicts for duplicate keys
                    for key, value in post_data.items():
                        if key not in consolidated_data[post_id]:
                            consolidated_data[post_id][key] = value
                        else:
                            if conflict_strategy == "overwrite":
                                consolidated_data[post_id][key] = value
                            

    return consolidated_data

# List of files to consolidate
input_files = ['main.json', 'sentiment.json', 'topic.json']

# Consolidate data with desired conflict resolution strategy
# Options: "overwrite", "keep_original", "combine"
consolidated_data = merge_posts(input_files, conflict_strategy="combine")

# Save the consolidated data to a new file
with open('consolidated_posts.json', 'w') as output_file:
    json.dump(consolidated_data, output_file, indent=4)

print("Posts consolidated successfully into 'consolidated_posts.json'.")
