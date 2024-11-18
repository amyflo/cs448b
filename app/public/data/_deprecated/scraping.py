import praw
import json
import time
from datetime import datetime, timezone
import os

# Initialize Reddit instance
reddit = praw.Reddit(client_id="Zk3HVdJ7mwyKORDOGIM0CQ",
client_secret="2AYpbw7QKWZv-LWrNKDiSU0hCHW6TA",
user_agent="my user agent")

# Define subreddit and file path
subreddit_name = "loveletters"  # Replace with actual subreddit name
json_file_path = "test3.json"
processed_posts = set()

# Load previously saved data if it exists
if os.path.exists(json_file_path):
    with open(json_file_path, mode="r", encoding="utf-8") as json_file:
        try:
            all_data = json.load(json_file)
            # Add existing post IDs to processed_posts to avoid duplicates
            processed_posts = {post["Post ID"] for post in all_data}
        except json.JSONDecodeError:
            all_data = []
else:
    all_data = []

# Set the maximum number of posts to collect
max_posts = 10000

# Main loop to fetch new posts and comments
while len(all_data) < max_posts:
    try:
        # Check subreddit validity
        try:
            subreddit = reddit.subreddit(subreddit_name)
            subreddit.new(limit=1)  # Test call to check if the subreddit is accessible
        except Exception as e:
            print(f"Failed to access subreddit '{subreddit_name}': {e}")
            time.sleep(60)
            continue

        new_data = []

        # Fetch the 100 most recent posts in the subreddit
        for submission in subreddit.new(limit=10):
            if submission.id not in processed_posts:
                
                print("submission.id")
                # Convert the timestamp to a timezone-aware UTC date
                post_date = datetime.fromtimestamp(submission.created_utc, timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

                # Gather post data
                post_data = {
                    "Post ID": submission.id,
                    "Title": submission.title,
                    "Body": submission.selftext,
                    "Author": str(submission.author),
                    "Num Comments": submission.num_comments,
                    "Score": submission.score,
                    "URL": submission.url,
                    "Date": post_date,
                    "Is Original Content": submission.is_original_content,
                    "Is Self Post": submission.is_self,
                    "Upvote Ratio": submission.upvote_ratio,
                    "Flair": submission.link_flair_text,
                    "Total Awards Received": submission.total_awards_received,
                    "Comments": []
                }

                # Load all comments for the post
                submission.comments.replace_more(limit=None)
                for comment in submission.comments.list():
                    # Convert comment timestamp to timezone-aware UTC date
                    comment_date = datetime.fromtimestamp(comment.created_utc, timezone.utc).strftime('%Y-%m-%d %H:%M:%S')

                    comment_data = {
                        "Comment ID": comment.id,
                        "Comment Author": str(comment.author),
                        "Comment Body": comment.body,
                        "Comment Score": comment.score,
                        "Comment Date": comment_date,
                        "Parent ID": comment.parent_id
                    }
                    post_data["Comments"].append(comment_data)

                # Add the post and its comments to the new data list
                new_data.append(post_data)
                processed_posts.add(submission.id)

                # Break if we've reached the maximum number of posts
                if len(all_data) + len(new_data) >= max_posts:
                    break

        # Append new data to all_data and write to JSON file
        if new_data:
            all_data.extend(new_data)
            with open(json_file_path, mode="w", encoding="utf-8") as json_file:
                json.dump(all_data, json_file, indent=4)

            print(f"Saved {len(new_data)} new posts to {json_file_path}. Total collected: {len(all_data)}")

        # Check if we've reached the maximum number of posts
        if len(all_data) >= max_posts:
            print("Reached maximum post limit. Exiting.")
            break

        time.sleep(10)

    except Exception as e:
        print(f"An error occurred: {e}")
        time.sleep(1)
