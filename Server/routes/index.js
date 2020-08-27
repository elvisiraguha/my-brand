import express from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import articles from "./articles.router.js";
import landing from "./profile.router.js";
import auth from "./auth.router.js";
import queries from "./queries.router.js";
import Response from "../helpers/responses.js";
import CommonMiddleware from "../middleware/common.middleware.js";
import swaggerJSON from "../../swagger.json";
import "../seeds/user.seed.js";
import "../seeds/profileInfo.seed.js";

const router = express.Router();

router.use(express.json());
router.use(cors());

router.use(CommonMiddleware.validRequest);
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSON));
router.use("/api/articles", articles);
router.use("/api/profile", landing);
router.use("/api/auth", auth);
router.use("/api/queries", queries);

router.use("/*", (req, res) => {
  Response.error(res, 405, "Method Not Allowed");
});

export default router;
