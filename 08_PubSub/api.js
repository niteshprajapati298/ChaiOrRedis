import express from "express";
import Redis from "ioredis";
const app = express();
app.use(express.json());

const publisher = new Redis(process.env.REDIS_PORT || "localhost:6379");
app.post("/notifications", async (req, res) => {
  const body = {
    title: req.body?.title || "Welcome!",
    message: req.body?.message || "Thank you for signing up!",
  };
 const receiver = await publisher.publish("notification", JSON.stringify(body));
  return res
    .status(200)
    .json({ message: "Notification Succesfully Pushed into Queue", receiver: receiver });
});

app.listen(8000, () => {  
    console.log(`Server is Listening on port 8000`);
});