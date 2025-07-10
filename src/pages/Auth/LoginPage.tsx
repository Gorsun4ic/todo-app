import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";


import { useLoginUserMutation } from "api/apiAuth";

type Inputs = {
	email: string;
	password: string;
};

const LoginPage = () => {
	const [serverError, setServerError] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();
	const [loginUser, { isLoading, isSuccess, error, data }] =
		useLoginUserMutation();
	const navigate = useNavigate();
	const onSubmit: SubmitHandler<Inputs> = (data) => loginUser(data);

	useEffect(() => {
		if (isSuccess && data?.token && data?.user) {
			reset();
			const timer = setTimeout(() => {
				navigate("/");
			}, 2000);

			return () => {
				clearTimeout(timer);
			};
		}
	}, [isSuccess, data, reset, navigate]);

	useEffect(() => {
		if (error) {
			setServerError(true);
		}
	}, [error]);

	return (
		<div className="container mx-auto max-w-[600px] w-full">
			<form className="min-w-xl" onSubmit={handleSubmit(onSubmit)}>
				<h1 className="mb-6">Log in form</h1>
				<p className="mb-8">Please, fill out this form to log in.</p>
				<input
					className={`border-1 outline-0 rounded-sm text-gray-600 py-4 px-2 w-full ${
						errors.email ? "mb-2" : "mb-4"
					}`}
					type="email"
					{...register("email", {
						required: {
							value: true,
							message: "Fill out this field",
						},
						pattern: {
							value: /^\S+@\S+$/,
							message: "Please enter a valid email address",
						},
					})}
					placeholder={"Email"}
				/>
				<ErrorMessage
					errors={errors}
					name="email"
					render={({ message }) => (
						<p className="text-red-500 text-sm mb-6 text-left">{message}</p>
					)}
				/>

				<input
					className={`border-1 outline-0 rounded-sm text-gray-600 py-4 px-2 w-full ${
						errors.email ? "mb-2" : "mb-4"
					}`}
					type="password"
					{...register("password", {
						required: {
							value: true,
							message: "Fill out this field",
						},
					})}
					placeholder={"Password"}
				/>
				<ErrorMessage
					errors={errors}
					name="password"
					render={({ message }) => (
						<p className="text-red-500 text-sm mb-12 text-left">{message}</p>
					)}
				/>
				<button
					className={`bg-gray-600 text-white py-4 px-2 w-full mb-${
						isSuccess ? "6" : "8"
					}`}
					type="submit">
					{isLoading ? "Authorizing..." : "Submit"}
				</button>
				{isSuccess && (
					<p className="text-green-600 text-center mb-6">
						You successfully logged in!
					</p>
				)}
				{serverError && (
					<p className="text-red-600 text-center mt-6">
						{(error as { data: { message: string } })?.data?.message || ""}
					</p>
				)}
				<p className="text-left">
					Don't have an account yet? <Link to="/registration">Register</Link>
				</p>
			</form>
		</div>
	);
};

export default LoginPage;
