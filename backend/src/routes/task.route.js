import Router from "express";
import { adminOnly, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getTaskWorkspace,
  updateTask,
  updateTaskChecklist,
  updateTaskWorkspace,
  userDashboardData,
} from "../controllers/task.controller.js";

const router = Router();

router.route("/create").post(isAuthenticated, adminOnly, createTask);
router.route("/").get(isAuthenticated, getTasks);
router
  .route("/dashboard-data")
  .get(isAuthenticated, adminOnly, getDashboardData);
router.route("/user-dashboard-data").get(isAuthenticated, userDashboardData);
router.route("/:id").get(isAuthenticated, getTaskById);
router.route("/:id").put(isAuthenticated, adminOnly, updateTask);
router.route("/:id").delete(isAuthenticated, adminOnly, deleteTask);
router.route("/:id/todo").put(isAuthenticated, updateTaskChecklist);
router.route("/:id/workspace").get(isAuthenticated, getTaskWorkspace);
router.route("/:id/workspace").put(isAuthenticated, updateTaskWorkspace);
export default router;
