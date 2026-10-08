import express from "express";
import Queue from "bullmq";
import { emailQueue } from "./queue.js";
const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.post("/emails", async (req, res) => {
  const body = {
    To: req.body?.to || "foo@example.com",
    From: req.body?.from || "bar@example.com",
    Subject: req.body?.Subject || "Welcome!",
    Content: req.body?.Content || "Thank you for signing up!",
  };
  const job = await emailQueue.add("send-welcome-email", body , {
    attempts: 3,
    backoff: 5000,
  });
  return res
    .status(200)
    .json({ message: "Email Succesfully Pushed into Queue", job: job });
});

app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
