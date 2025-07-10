import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type ITaskList } from "types/task";
interface ITask {
	_id: string;
	title: string;
	description?: string;
	completed: boolean;
	taskList: string;
}

interface ApiResponse<T> {
	data?: T;
	message?: string;
	token?: string;
	user?: { id: string; name: string; email: string };
}

interface ICreateTaskListInput {
	name: string;
}

interface ICreateTaskInput {
	title: string;
	description?: string;
}

interface IAddParticipantInput {
	email: string;
	role: "Admin" | "Viewer";
}

interface IUpdateTaskInput {
	title?: string;
	description?: string;
	completed?: boolean;
}

const BASE_URL = "http://localhost:5000/api";

export const taskApiSlice = createApi({
	reducerPath: "taskApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		credentials: "include",
	}),
	tagTypes: ["TaskList", "Task"],
	endpoints: (builder) => ({
		getTaskLists: builder.query<ApiResponse<ITaskList[]>, void>({
			query: () => "/lists",
			providesTags: [{ type: "TaskList", id: "LIST" }],
		}),
		createTaskList: builder.mutation<
			ApiResponse<ITaskList>,
			ICreateTaskListInput
		>({
			query: (list) => ({
				url: "/lists",
				method: "POST",
				body: list,
			}),
			invalidatesTags: [{ type: "TaskList", id: "LIST" }],
		}),
		addParticipantToList: builder.mutation<
			ApiResponse<ITaskList>,
			{ listId: string; participant: IAddParticipantInput }
		>({
			query: ({ listId, participant }) => ({
				url: `/lists/${listId}/participants`,
				method: "POST",
				body: participant,
			}),
			invalidatesTags: (_result, _error, { listId }) => [
				{ type: "TaskList", id: listId },
			],
		}),
		deleteTaskList: builder.mutation<ApiResponse<string>, { listId: string }>({
			query: ({ listId }) => ({
				url: `/lists/${listId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, { listId }) => [
				{ type: "TaskList", id: listId },
			],
		}),
		getTasksByList: builder.query<ApiResponse<ITask[]>, string>({
			query: (taskListId) => `/tasks/${taskListId}`,
			providesTags: (_result, _error, taskListId) => [
				{ type: "Task", id: taskListId },
			],
		}),
		createTask: builder.mutation<
			ApiResponse<ITask>,
			{ taskListId: string; task: ICreateTaskInput }
		>({
			query: ({ taskListId, task }) => ({
				url: `/tasks/${taskListId}`,
				method: "POST",
				body: task,
			}),
			invalidatesTags: (_result, _error, { taskListId }) => [
				{ type: "Task", id: taskListId },
			],
		}),
		toggleTaskCompleted: builder.mutation<
			ApiResponse<ITask>,
			{ taskId: string; taskListId: string }
		>({
			query: ({ taskId }) => ({
				url: `/tasks/${taskId}/toggle`,
				method: "PATCH",
			}),
			invalidatesTags: (_result, _error, { taskListId }) => [
				{ type: "Task", id: taskListId },
			],
		}),
		updateTask: builder.mutation<
			ApiResponse<ITask>,
			{ taskId: string; taskListId: string; updates: IUpdateTaskInput }
		>({
			query: ({ taskId, updates }) => ({
				url: `/tasks/${taskId}`,
				method: "PUT",
				body: updates,
			}),
			invalidatesTags: (_result, _error, { taskListId }) => [
				{ type: "Task", id: taskListId },
			],
		}),
		deleteTask: builder.mutation<
			ApiResponse<string>,
			{ taskId: string; taskListId: string }
		>({
			query: ({ taskId }) => ({
				url: `/tasks/${taskId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, { taskListId }) => [
				{ type: "Task", id: taskListId },
			],
		}),
	}),
});

export const {
	useGetTaskListsQuery,
	useCreateTaskListMutation,
	useAddParticipantToListMutation,
	useGetTasksByListQuery,
	useCreateTaskMutation,
	useToggleTaskCompletedMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useDeleteTaskListMutation
} = taskApiSlice;
