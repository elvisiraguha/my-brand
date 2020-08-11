import express from "express";
import Articles from "../controllers/articles.controller.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", Articles.getOne);
router.post("/", Articles.create);

export default router;
