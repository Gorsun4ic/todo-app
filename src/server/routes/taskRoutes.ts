import { Router } from "express";
import { protect } from "../middleware/auth";
import {
	createTask,
	getTasksByList,
	updateTask,
	toggleTaskCompleted,
	deleteTask,
} from "../controllers/taskController";

const router = Router();

router.post("/:taskListId", protect, createTask);
router.get("/:taskListId", protect, getTasksByList);
router.put("/:taskId", protect, updateTask);
router.patch("/:taskId/toggle", protect, toggleTaskCompleted);
router.delete("/:taskId", protect, deleteTask);

export default router;
