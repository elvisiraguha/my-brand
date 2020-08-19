import express from "express";
import articles from "./articles.router.js";
import auth from "./auth.router.js";
import Response from "../helpers/responses.js";

const router = express.Router();

router.use("/api/articles", articles);
router.use("/api/auth", auth);

router.use("/*", (req, res) => {
  Response.error(res, 405, "Method Not Allowed");
});

export default router;
