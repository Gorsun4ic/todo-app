import type { Request, Response } from "express";
import dotenv from "dotenv";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

import { type AuthRequest } from "types/user";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (req: Request, res: Response) => {
	const { name, email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		user = new User({ name, email, password: hashedPassword });
		await user.save();

		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
		res
			.status(201)
			.json({
				token,
				user: { id: user._id, name: user.name, email: user.email },
			});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
		res
			.cookie("jwt", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			})
			.status(200)
			.json({
				token,
				user: { id: user._id, name: user.name, email: user.email },
			});
	} catch (error) {
		res.status(500).json({ message: (error as Error).message });
	}
};

// Check if user is authorized
export const checkAuth = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({
				success: false,
				error: {
					message: "User ID not found in request after authentication.",
					code: 401,
				},
			});
		}

		const user = await User.findById(req.user.id).select("-password");

		if (!user) {
			return res.status(404).json({
				success: false,
				error: {
					message: "User associated with token not found.",
					code: 404,
				},
			});
		}

		res.status(200).json({
			success: true,
			message: "User is authorized",
			data: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		res.status(500).json({
			success: false,
			error: {
				message: "Internal Server Error during authentication check.",
				code: 500,
			},
		});
	}
};