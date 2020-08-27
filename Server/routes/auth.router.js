import express from "express";
import Auth from "../controllers/auth.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signin", AuthMiddleware.signin, Auth.signin);

export default router;
