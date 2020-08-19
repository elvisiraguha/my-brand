import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes";

const mongodb_url =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_DB_URL_PRO
    : process.env.MONGO_DB_URL_DEV;

const app = express();

mongoose
  .connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Error while trying to connect to database! ", error);
  });

app.use(express.json());
app.use(router);

export default app;