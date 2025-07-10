// src/components/TodoList.tsx
import { useState, useEffect } from "react";
import {
	useGetTasksByListQuery,
	useCreateTaskMutation,
	useToggleTaskCompletedMutation,
	useDeleteTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskListMutation
} from "api/apiTaskLists";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import type { ITaskList } from "types/task";
import Modal from "components/popup";
import Checkpoint from "components/CheckPoint";
interface TodoListProps {
	data?: ITaskList[];
}

type Inputs = {
	title: string;
	description?: string;
};

const TodoList = ({ data }: TodoListProps) => {
	const [selectedTaskListId, setSelectedTaskListId] = useState<string | null>(
		null
	);
	const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

	const [toggleTaskCompleted] = useToggleTaskCompletedMutation();
	const [deleteTask] = useDeleteTaskMutation();
	const [updateTask] = useUpdateTaskMutation();
	const [deleteTaskList] = useDeleteTaskListMutation();
	const [addTask, { isSuccess }] = useCreateTaskMutation();
	
	const {
		data: tasksData,
		error,
		isLoading,
	} = useGetTasksByListQuery(selectedTaskListId || "", {
		skip: !selectedTaskListId,
	});
	const [showForm, setShowForm] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [serverError, setServerError] = useState<boolean>(false);
	const [selectedTaskListName, setSelectedTaskListName] = useState<string>("");

	useEffect(() => {
		if (isSuccess) {
			reset();
			setShowForm(false);
		}
	}, [isSuccess, setShowForm, reset]);

	useEffect(() => {
		if (error) {
			setServerError(true);
		}
	}, [error]);

	const handleOpenModal = (listId: string, listName: string) => {
		setSelectedTaskListId(listId);
		setSelectedTaskListName(listName);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedTaskListId(null);
		setSelectedTaskListName("");
	};

	const onEdit = (task: Inputs & { _id: string }) => {
		setShowForm(true);
		setEditingTaskId(task._id);
		reset({
			title: task.title,
			description: task.description,
		});
	};

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		if (editingTaskId) {
			updateTask({
				taskId: editingTaskId,
				taskListId: selectedTaskListId!,
				updates: data,
			});
			
			setEditingTaskId(null);
			setShowForm(false);
		} else {
			addTask({ taskListId: selectedTaskListId!, task: data });
		}
	}

	return (
		<div className="space-y-4 flex flex-wrap gap-4 items-baseline mt-6 justify-center">
			{data && data.length > 0 ? (
				data.map((item) => (
					<div
						key={item._id}
						onClick={() => handleOpenModal(item._id, item.name)}
						className="p-4 py-6 bg-zinc-700 rounded-lg shadow-md
                       cursor-pointer hover:bg-zinc-600 transition-colors duration-200
                       w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 flex-grow">
						<h3 className="text-xl font-semibold text-white">{item.name}</h3>
						<p className="text-sm text-gray-300 mt-1">
							Owner: {item.owner.name}
						</p>
						<p className="text-sm text-gray-300">
							Participants: {item.participants.length}
						</p>
					</div>
				))
			) : (
				<p className="text-gray-600 text-center w-full">
					No task lists to display.
				</p>
			)}

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={selectedTaskListName}>
				{tasksData?.length > 0 ? (
					tasksData?.map((item) => (
						<div className="bg-slate-100 mb-10 flex justify-between p-2 rounded-xs gap-4">
							<div className="flex gap-4">
								<Checkpoint
									active={item?.completed}
									onClick={() => {
										toggleTaskCompleted({
											taskId: item._id,
											taskListId: selectedTaskListId!,
										});
									}}
								/>
								<div className="text-left">
									<h4 className="text-2xl mb-2">{item?.title}</h4>
									<p className="text-base">{item?.description}</p>
								</div>
							</div>
							<button onClick={() => onEdit(item)} className="text-orange-300">
								&#9998;
							</button>
							<button
								onClick={() =>
									deleteTask({
										taskId: item?._id,
										taskListId: selectedTaskListId,
									})
								}
								className="text-red-600">
								&times;
							</button>
						</div>
					))
				) : (
					<p className="mb-4">There is no tasks yet</p>
				)}
				{showForm && (
					<form
						className="min-w-xl border-1 p-6 mb-6 rounded-lg"
						onSubmit={handleSubmit(onSubmit)}>
						<input
							className={`border-b-1 outline-0 rounded-sm text-gray-600 py-4 px-2 w-full ${
								errors.title ? "mb-2" : "mb-4"
							}`}
							{...register("title", {
								required: {
									value: true,
									message: "Fill out this field",
								},
							})}
							placeholder={"Task title"}
						/>
						<ErrorMessage
							errors={errors}
							name="title"
							render={({ message }) => (
								<p className="text-red-500 text-sm mb-6 text-left">{message}</p>
							)}
						/>

						<input
							className={`border-b-1 outline-0 rounded-sm text-gray-600 py-4 px-2 w-full ${
								errors.description ? "mb-2" : "mb-4"
							}`}
							{...register("description", {
								required: {
									value: true,
									message: "Fill out this field",
								},
							})}
							placeholder={"Task Description"}
						/>
						<ErrorMessage
							errors={errors}
							name="description"
							render={({ message }) => (
								<p className="text-red-500 text-sm mb-6 text-left">{message}</p>
							)}
						/>
						<button
							className={`bg-gray-600 text-white py-4 px-2 w-full mb-${
								isSuccess ? "6" : "8"
							}`}
							type="submit">
							{isLoading ? "Creating..." : "Submit"}
						</button>
						{isSuccess && (
							<p className="text-green-600 text-center mb-6">
								List was created successful!
							</p>
						)}
						{serverError && (
							<p className="text-red-600 text-center mt-6">
								{(error as { data: { message: string } })?.data?.message || ""}
							</p>
						)}
					</form>
				)}
				<button
					className="bg-neutral-500 text-white mb-6"
					onClick={() => setShowForm(!showForm)}>
					Add new task
				</button>
			</Modal>
		</div>
	);
};

export default TodoList;
