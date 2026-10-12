import express from "express";
const port = process.env.PORT || 8000;
const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is Listening on port ${port}`);
});
