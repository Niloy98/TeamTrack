import Router from "express";
import {
  loginUser,
  logout,
  registerUser,
} from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/signup").post(upload.single("profilePicture"), registerUser);

router.route("/login").post(loginUser);

router.route("/signout").post(logout);

export default router;
