import Router from "express";
import { adminOnly, isAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllUsers } from "../controllers/user.controller.js";

const router = Router();

router.route("/get-all-users").get(isAuthenticated, adminOnly, getAllUsers);

export default router;
