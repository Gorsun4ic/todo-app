import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
	user?: { id: string };
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protect = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	const token = req.cookies?.jwt;

	if (!token) {
		return res.status(401).json({ message: "Not authorized, no token" });
	}

	try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const decoded: any = jwt.verify(token, JWT_SECRET);
		req.user = { id: decoded.id };
		next();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		res.status(401).json({ message: "Not authorized, token failed" });
	}
};
