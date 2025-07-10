import { Document, type ObjectId } from "mongoose";
import type { Request } from "express";


export interface IUserBackend extends Document {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
}

export interface IUser {
	id: string;
	email: string;
	name: string;
	password?: string;
}

export interface AuthRequest extends Request {
	user?: { id: string };
}
