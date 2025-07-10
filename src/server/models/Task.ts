import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
	title: string;
	description?: string;
	completed: boolean;
	taskList: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String },
		completed: { type: Boolean, default: false },
		taskList: { type: Schema.Types.ObjectId, ref: "TaskList", required: true },
	},
	{ timestamps: true }
);

export default mongoose.model<ITask>("Task", TaskSchema);
