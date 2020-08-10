import express from "express";
import "dotenv/config";

const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(port, () => console.log(`App started on port: ${port}...`));
