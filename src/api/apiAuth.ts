import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IUser } from "types/user";

interface ApiResponse<T> {
	data?: T;
	message?: string;
	token?: string;
	user?: { id: string; name: string; email: string };
}

interface ICheckAuthResponse {
	success: boolean;
	message: string;
	data?: { id: string; name: string; email: string };
}

interface IRegisterInput {
	name: string;
	email: string;
	password: string;
}

interface ILoginInput {
	email: string;
	password: string;
}

const BASE_URL = "http://localhost:5000/api";

export const authSlice = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: BASE_URL,
		credentials: "include",
	}),
	tagTypes: ["User"],
	endpoints: (builder) => ({
		registerUser: builder.mutation<
			ApiResponse<{ token: string; user: IUser }>,
			IRegisterInput
		>({
			query: (user) => ({
				url: "/auth/register",
				method: "POST",
				body: user,
			}),
			invalidatesTags: ["User"],
		}),
		loginUser: builder.mutation<
			ApiResponse<{ token: string; user: IUser }>,
			ILoginInput
		>({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
				credentials: "include",
			}),
			invalidatesTags: ["User"],
		}),
		checkAuthStatus: builder.query<ICheckAuthResponse, void>({
			query: () => ({
				url: "/auth/check",
				credentials: "include",
			}),
			providesTags: ["User"],
		}),
	}),
});

export const { useRegisterUserMutation, useLoginUserMutation, useCheckAuthStatusQuery } = authSlice;
