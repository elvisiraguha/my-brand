import express from "express";
import Auth from "../middleware/auth.middleware.js";
import QueriesController from '../controllers/queries.controller.js'
import QueriesMiddleware from '../middleware/queries.middleware.js'

const router = express.Router();

router.get("/", Auth.checkToken, QueriesController.get);
router.post("/", QueriesMiddleware.validate, QueriesController.post);
router.patch("/:id", Auth.checkToken, QueriesMiddleware.update, QueriesController.update);

export default router;
