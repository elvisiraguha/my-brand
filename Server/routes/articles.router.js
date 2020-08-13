import express from "express";
import Articles from "../controllers/articles.controller.js";

const router = express.Router();

router.get("/", Articles.get);
router.get("/:id", Articles.getOne);
router.post("/", Articles.create);
router.patch("/:id", Articles.update);
router.delete("/:id", Articles.delete);

export default router;
