import express from "express";
import Redis from "ioredis";

const app = express();
const port = process.env.PORT || 3000;
const redis = new Redis(process.env.REDIS_PORT || "redis://localhost:6379");

app.use(express.json());
app.use(express.json());
function getUserKey(id, type) {
  return `user:${id}:${type}`;
}

app.post("/user/:id/json", async (req, res) => {
  const id = req.params.id;
  const type = "json";
  await redis.set(getUserKey(id, type), JSON.stringify(req.body));
  return res.status(201).json({ message: "JSON user saved successfully" });
});

app.post("/user/:id/hash", async (req, res) => {
  const id = req.params.id;
  const type = "hset";
  await redis.hset(getUserKey(id, type), req.body);
  return res.status(201).json({ message: "Hash user saved successfully" });
});

app.get("/user/:id/hash", async (req, res) => {
  const id = req.params.id;
  const type = "hset";
  const userData = await redis.hgetall(getUserKey(id, type));
  return res.status(200).json({ message: "User Hash data fetched successfully", data: userData });
});

app.get("/user/:id/json", async (req, res) => {
  const id = req.params.id;
  console.log("userid : " ,id);
  const type = "json";
  const userData = await redis.get(getUserKey(id, type));
  // console.log("userData : ",userData);
  return res.status(200).json({
    message: userData ? "User JSON fetched successfully" : "No user data found",
    data: userData ? JSON.parse(userData) : null,
  });
});

app.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
});
