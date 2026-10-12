import Redis from "ioredis";
const subscriber = new Redis(process.env.REDIS_PORT || "localhost:6379");

subscriber.subscribe("notification", (err) => {
  if (err) {
    console.error("Failed to subscribe: %s", err.message);
  }
  console.log(
    `Subscribed successfully! Listening for notifications on the 'notification' channel...`,
  );
});

subscriber.on("message", async (channel, message) => {
  console.log(
    "Received message from channel",
    channel,
    " : ",
    JSON.parse(message),
  );
  const job = JSON.parse(message);
  console.log("Processing Email Job : ", job);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log("Email Job Completed : ", job);
});
