import express from "express";
const port = process.env.PORT || 8000;
const app = express();
import Redis from "ioredis";
app.use(express.json());
const redis = new Redis();
const getPostKey = (postId) => `post:${postId}`;
app.post("/post/:postId/view", async (req, res) => {
  const postId = req.params.postId;
  const postKey = getPostKey(postId);
  const viewCount = await redis.incr(postKey);
  return res
    .status(200)
    .json({ message: "View Count Incremented", viewCount: viewCount });
});
app.get("/post/:postId/views", async (req, res) => {
  const postId = req.params.postId;
  const postKey = getPostKey(postId);
  const viewCount = await redis.get(postKey);
  return res
    .status(200)
    .json({ message: "View Count Fetched", viewCount: viewCount });
});

app.post("/leaderboard/score", async (req, res) => {
  const { userId, score } = req.body;
  if (!userId || !score) {
    return res.status(400).json({ message: "userId and score are required" });
  }
  await redis.zincrby("leaderboard", score, userId);
  return res.status(200).json({ message: "Score Added to Leaderboard" });
});
app.get("/leaderboard", async (req, res) => {
  const count = parseInt(req.params.count, 10) || 10;
  if (isNaN(count) || count <= 0) {
    return res
      .status(400)
      .json({ message: "Count must be a positive integer" });
  }
  const topUsers = await redis.zrevrange(
    "leaderboard",
    0,
    count - 1,
    "WITHSCORES",
  );
  const formattedTopUsers = [];
  for (let i = 0; i < topUsers.length; i += 2) {
    formattedTopUsers.push({
      userId: topUsers[i],
      score: parseInt(topUsers[i + 1], 10),
    });
  }
  return res
    .status(200)
    .json({ message: "Top Users Fetched", topUsers: formattedTopUsers });
});

app.get("/leaderboard/:userId/rank", async (req, res) => {
  const userId = req.params.userId;
  const rank = await redis.zrevrank("leaderboard", userId);
  if (rank === null) {
    return res.status(404).json({ message: "User not found in leaderboard" });
  }
  return res
    .status(200)
    .json({ message: "User Rank Fetched", rank: rank + 1 });
});

app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
