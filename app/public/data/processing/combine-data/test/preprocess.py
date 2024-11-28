import json

def reformat_json(input_file, output_file):
    """
    Reformat JSON data to use the postId as the key for each entry.
    """
    try:
        # Load the original JSON data
        with open(input_file, 'r') as infile:
            data = json.load(infile)

        # Reformatted dictionary
        reformatted_data = {}

        # Iterate over the original data and reformat
        for entry in data:
            post_id = entry.get("postId")
            if post_id:
                reformatted_data[post_id] = {k: v for k, v in entry.items() if k != "postId"}
            else:
                print(f"Skipping entry without 'postId': {entry}")

        # Save the reformatted data to a new file
        with open(output_file, 'w') as outfile:
            json.dump(reformatted_data, outfile, indent=4)

        print(f"Data reformatted successfully and saved to '{output_file}'.")

    except Exception as e:
        print(f"An error occurred: {e}")

# Input and output file paths
input_file = 'results.json'
output_file = 'sentiment-new.json'

# Reformat the JSON
reformat_json(input_file, output_file)
