import type { Response } from "express";
import TaskList from "../models/TaskList";
import User from "../models/User";

import { type AuthRequest } from "types/user";

export const createTaskList = async (req: AuthRequest, res: Response) => {
	const { name } = req.body;
	try {
		const newTaskList = new TaskList({
			name,
			owner: req.user?.id,
			participants: [{ userId: req.user?.id, role: "Admin" }],
		});
		const createdList = await newTaskList.save();
		res.status(201).json(createdList);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const deleteTaskList = async (req: AuthRequest, res: Response) => {
	const { listId } = req.params;

	try {
		const taskList = await TaskList.findById(listId);
		if (!taskList) {
			return res.status(404).json({ message: "Task list not found" });
		}

		if (req.user?.id !== taskList.owner.toString()) {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this task list" });
		}

		await taskList.deleteOne();

		res.status(200).json({ message: "Task list deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Getting all task list where user is participant
export const getUserTaskLists = async (req: AuthRequest, res: Response) => {
	try {
		const taskLists = await TaskList.find({
			"participants.userId": req.user?.id,
		})
			.populate("owner", "name email")
			.populate("participants.userId", "name email");
		res.status(200).json(taskLists);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};


// Adding new participant (available only for owner)
export const addParticipant = async (req: AuthRequest, res: Response) => {
  const { listId } = req.params;
  const { email, role } = req.body; // role: 'Admin' | 'Viewer'
  try {
		const taskList = await TaskList.findById(listId);
		if (!taskList) {
			return res.status(404).json({ message: "Task list not found" });
		}

		// Owner verification
		if (req.user?.id !== taskList.owner.toString()) {
			return res
				.status(403)
				.json({
					message:
						"Not authorized to add participants: Only the owner can add participants.",
				});
		}

		const newParticipantUser = await User.findOne({ email });
		if (!newParticipantUser) {
			return res
				.status(404)
				.json({ message: "User with this email not found" });
		}

		// Check if the user is already a participant
		const existingParticipant = taskList.participants.find(
			(p) => p.userId.toString() === newParticipantUser._id.toString()
		);
		if (existingParticipant) {
			return res.status(400).json({ message: "User is already a participant" });
		}

		taskList.participants.push({ userId: newParticipantUser._id, role });
		await taskList.save();
		res.status(200).json(taskList);
	} catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};


// Getting user's role in the specific list
export const getUserRoleInList = async (
	userId: string,
	listId: string
): Promise<"Admin" | "Viewer" | undefined> => {
	const taskList = await TaskList.findById(listId);
	if (!taskList) return undefined;
	const participant = taskList.participants.find(
		(p) => p.userId.toString() === userId
	);
	return participant?.role;
};
