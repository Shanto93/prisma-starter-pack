import express from "express";
import { apiLimiter } from "../middlewares/rateLimiter.js";
import { userRoutes } from "../modules/users/users.routes.js";

const router = express.Router();

router.use(apiLimiter);

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
