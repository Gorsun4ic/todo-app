import mongoose, { Document, Schema } from "mongoose";

export interface IParticipant {
	userId: mongoose.Schema.Types.ObjectId;
	role: "Admin" | "Viewer";
}

export interface ITaskList extends Document {
	name: string;
	owner: mongoose.Schema.Types.ObjectId; 
	participants: IParticipant[];
}

const TaskListSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
		participants: [
			{
				userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
				role: { type: String, enum: ["Admin", "Viewer"], default: "Viewer" },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model<ITaskList>("TaskList", TaskListSchema);
