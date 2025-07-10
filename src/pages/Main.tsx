import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import TodoList from "components/todo/todoList";

import { useCheckAuthStatusQuery } from "api/apiAuth";
import { useCreateTaskListMutation, useGetTaskListsQuery } from "api/apiTaskLists";

type Inputs = {
	name: string;
	description?: string;
};

const MainPage = () => {
	const navigate = useNavigate();
	const {
		data: taskListsData,
	} = useGetTaskListsQuery();
	const [addTaskList, { isLoading, isSuccess, error }] =
		useCreateTaskListMutation();
	const { data: userData } = useCheckAuthStatusQuery();

	const [showForm, setShowForm] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();
	const [serverError, setServerError] = useState<boolean>(false);
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


	const onSubmit: SubmitHandler<Inputs> = (data) => addTaskList(data);


	if (!userData) {
		return (
			<div>
				<h1 className="mb-6">Todo App</h1>
				<p className="mb-12">Welcome, to out application!</p>
				<button
					className="text-white bg-gray-600"
					onClick={() => navigate("/login")}>
					Get started
				</button>
			</div>
		);
	}
	return (
		<div>
			<h1 className="mb-6">Hello, {userData?.data?.name}</h1>
			<button
				className="bg-neutral-500 text-white mb-6"
				onClick={() => setShowForm(!showForm)}>
				Add new task list
			</button>
			{showForm && (
				<form
					className="min-w-xl border-1 p-6 rounded-lg"
					onSubmit={handleSubmit(onSubmit)}>
					<input
						className={`border-b-1 outline-0 rounded-sm text-gray-600 py-4 px-2 w-full ${
							errors.name ? "mb-2" : "mb-4"
						}`}
						{...register("name", {
							required: {
								value: true,
								message: "Fill out this field",
							},
						})}
						placeholder={"List name"}
					/>
					<ErrorMessage
						errors={errors}
						name="name"
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
						placeholder={"Description"}
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
			<TodoList data={taskListsData} />
		</div>
	);
};
export default MainPage;
