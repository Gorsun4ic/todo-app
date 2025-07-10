import type { Response } from "express";
import Task from "../models/Task";
import { getUserRoleInList } from "./taskListController";

import { type AuthRequest } from "types/user";


export const createTask = async (req: AuthRequest, res: Response) => {
	const { taskListId } = req.params;
	const { title, description } = req.body;
	try {
		const userRole = await getUserRoleInList(req.user!.id, taskListId);
		if (userRole !== "Admin") {
			return res
				.status(403)
				.json({ message: "Not authorized to create tasks in this list" });
		}

		const newTask = new Task({ title, description, taskList: taskListId });
		const createdTask = await newTask.save();
		res.status(201).json(createdTask);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const getTasksByList = async (req: AuthRequest, res: Response) => {
	const { taskListId } = req.params;
	try {
		const userRole = await getUserRoleInList(req.user!.id, taskListId);
		if (!userRole) {
			// If the user is not a participant
			return res
				.status(403)
				.json({ message: "Not authorized to view this list" });
		}
		const tasks = await Task.find({ taskList: taskListId });
		res.status(200).json(tasks);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Update the task (Admin)
export const updateTask = async (req: AuthRequest, res: Response) => {
	const { taskId } = req.params;
	const { title, description, completed } = req.body;
	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const userRole = await getUserRoleInList(
			req.user!.id,
			task.taskList.toString()
		);
		if (userRole !== "Admin") {
			return res
				.status(403)
				.json({ message: "Not authorized to update this task" });
		}

		task.title = title || task.title;
		task.description = description || task.description;
		task.completed =
			typeof completed === "boolean" ? completed : task.completed;

		await task.save();
		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Mark the task as a completer/uncompleted
export const toggleTaskCompleted = async (req: AuthRequest, res: Response) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const userRole = await getUserRoleInList(
			req.user!.id,
			task.taskList.toString()
		);
		if (!userRole) {
			// If the user is not a participant
			return res
				.status(403)
				.json({ message: "Not authorized to modify this task" });
		}

		task.completed = !task.completed;
		await task.save();
		res.status(200).json(task);
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Delete the task (Admin)
export const deleteTask = async (req: AuthRequest, res: Response) => {
	const { taskId } = req.params;
	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const userRole = await getUserRoleInList(
			req.user!.id,
			task.taskList.toString()
		);
		if (userRole !== "Admin") {
			return res
				.status(403)
				.json({ message: "Not authorized to delete this task" });
		}

		await task.deleteOne();
		res.status(200).json({ message: "Task removed" });
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};
