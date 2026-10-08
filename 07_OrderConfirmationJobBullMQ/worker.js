import { Worker } from "bullmq";
import { connection } from "./queue.js";

const worker = new Worker(
  "emails",
  async (job) => {
    console.log("Processing Email Job : ");
    setTimeout(() => {}, 1500);
    console.log("Email Job Completed : ");
  },
  { connection },
);

worker.on("completed", (job) => {
  console.log("Job Completed ", job.id, job.name, job.data);
});
worker.on("failed", (job) => {
  console.log("Job Failed ", job.id, job.name, job.data);
});



