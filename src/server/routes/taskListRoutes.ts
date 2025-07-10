import { Router } from "express";
import { protect } from "../middleware/auth";
import {
	createTaskList,
	getUserTaskLists,
	addParticipant,
	deleteTaskList
} from "../controllers/taskListController";

const router = Router();

router.post("/", protect, createTaskList);
router.get("/", protect, getUserTaskLists);
router.delete("/:listId", protect, deleteTaskList);
router.post("/:listId/participants", protect, addParticipant);

export default router;
