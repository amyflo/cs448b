const fs = require("fs");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// Read JSON Data from File
const filePath = "../output.json";
let postData;

try {
  const data = fs.readFileSync(filePath, "utf8");
  posts = JSON.parse(data).post;
  console.log("Data successfully loaded from output.json");
} catch (err) {
  console.error("Error reading or parsing output.json:", err);
  process.exit(1);
}

// Analyze Sentiment for Each Section
const analyzeSentiment = (text) => sentiment.analyze(text);
const results = Object.entries(posts).map(([postId, postData]) => {
  const titleSentiment = analyzeSentiment(postData.title);
  const bodySentiment = analyzeSentiment(postData.body);

  const commentsSentiment = (postData.comments || []).map((comment, index) => ({
    commentId: index + 1,
    username: comment.username,
    sentiment: analyzeSentiment(comment.body),
  }));

  const totalCommentScore = commentsSentiment.reduce(
    (sum, comment) => sum + comment.sentiment.score,
    0
  );
  const averageCommentScore =
    commentsSentiment.length > 0
      ? totalCommentScore / commentsSentiment.length
      : 0;

  return {
    postId,
    titleSentiment,
    bodySentiment,
    commentsSentiment,
    commentsSentiment,
    averageCommentScore,
  };
});

// const visualizationData = results.map((postResult) => ({
//   postId: postResult.postId,
//   titleScore: postResult.titleSentiment.score,
//   bodyScore: postResult.bodySentiment.score,
//   commentScores: postResult.commentsSentiment.map((c) => c.sentiment.score),
// }));

const outputFilePath = "./sentiment-results.json";
try {
  fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2));
  console.log(`Sentiment analysis results written to ${outputFilePath}`);
} catch (err) {
  console.error("Error writing to JSON file:", err);
}
