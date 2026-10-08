import express, { raw } from "express";
import Redis from "ioredis";
const port = process.env.PORT || 8000;
const app = express();
const redis = new Redis(process.env.REDIS_PORT || "localhost:6379");

app.use(express.json());

const EMAIL_QUEUE = "email:queue";
app.post("/emails", async (req, res) => {
  const body = {
    To: req.body?.to || "nitesh@gmail.com",
    From: req.body?.from || "k@gmail.com",
    Subject: req.body?.Subject || "No Subject",
    Content: req.body?.from || "No Content",
  };
  const job = await redis.lpush(EMAIL_QUEUE, JSON.stringify(body));
  return res
    .status(200)
    .json({ message: "Email Succesfully Pushed into Queue", job: job });
});

app.get("/emails/process-one", async (req, res) => {
  const rawJob = await redis.rpop(EMAIL_QUEUE);
  if (!rawJob)
    return res.status(400).json({
      message: "No email job found in the queue",
    });
  const job = JSON.parse(rawJob);
  return res
    .status(200)
    .json({ message: "Job Processed Successfully ", job: job });
});

app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
