export interface ITaskList {
	_id: string;
	name: string;
	owner: { _id: string; name: string; email: string };
	participants: IParticipant[];
}

export interface IParticipant {
	userId: { _id: string; name: string; email: string };
	role: "Admin" | "Viewer";
}
