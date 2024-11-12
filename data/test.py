import csv
import json
from collections import defaultdict

def process_csv_to_json(csv_file):
    data = defaultdict(lambda: {
        "title": "",
        "body": "",
        "createdAt": "",
        "topics": [],
        "html": "",
        "numberOfComments": 0,
        "upVoteRatio": 0,
        "upVotes": 0,
        "url": "",
        "username": "",
        "comments": []
    })

    with open(csv_file, mode='r') as file:
        csv_reader = csv.DictReader(file)
        headers = [field.strip('\ufeff"') for field in csv_reader.fieldnames]
        csv_reader.fieldnames = headers 
        
        for row in csv_reader:
            type = row["dataType"]
            post_id = row["id"]

            if type == "post":

                # Populate the main post data
                data[post_id].update({
                    "title": row["title"],
                    "body": row.get(headers[0], ""),
                    "createdAt": row["createdAt"],
                    "html": row.get("html", ""),
                    "numberOfComments": int(row.get("numberOfComments", 0)),
                    "upVoteRatio": float(row.get("upVoteRatio", 0)),
                    "upVotes": int(row.get("upVotes", 0)),
                    "url": row.get("url", ""),
                    "username": row.get("username", "")
                })
                
            elif type == "comment":
                # Add comment to the post's comments array
                comment = {
                    "body": row.get(headers[0], ""),
                    "parentID": row.get("postId", ""),
                    "commentId": row["id"],
                    "url": row.get("url", ""),
                    "username": row.get("username", ""),
                    "createdAt": row["createdAt"]
                }
                data["postId"]["comments"].append(comment)

    # Convert defaultdict to regular dict
    final_data = {"post": dict(data)}

    # Output JSON data
    json_data = json.dumps(final_data, indent=4)
    return json_data

# Usage example:
csv_file = "uncleaned-data.csv"
json_result = process_csv_to_json(csv_file)
output_file = "output.json"

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(json_result, f, indent=4)

print(f"JSON data has been written to {output_file}")