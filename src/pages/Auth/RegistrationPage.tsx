import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import { useRegisterUserMutation } from "api/apiAuth";

type Inputs = {
	email: string;
	name: string;
	password: string;
};

const RegistrationPage = () => {
	const [serverError, setServerError] = useState<boolean>(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();
	const [registerUser, { isLoading, isSuccess, error, data }] =
		useRegisterUserMutation();
	const navigate = useNavigate();
	const onSubmit: SubmitHandler<Inputs> = (data) => registerUser(data);

	useEffect(() => {
		if (isSuccess) {
			reset();
			const timer = setTimeout(() => {
				navigate("/login")
			}, 2000);

			return () => {
				clearTimeout(timer);
			}
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
				<h1 className="mb-6">Registration form</h1>
				<p className="mb-8">Please, fill out this form to register.</p>
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
					{...register("name", {
						required: {
							value: true,
							message: "Fill out this field",
						},
					})}
					placeholder={"Name"}
				/>
				<ErrorMessage
					errors={errors}
					name="name"
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
						pattern: {
							value:
								// eslint-disable-next-line no-useless-escape
								/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-])[A-Za-z\d!@#$%^&*()_+={}\[\]|:;"'<>,.?/~`-]{8,}$/,
							message:
								"Your password needs to be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
						},
					})}
					placeholder={"Password"}
				/>
				<ErrorMessage
					errors={errors}
					name="password"
					render={({ message }) => (
						<p className="text-red-500 text-sm mb-8 text-left">{message}</p>
					)}
				/>
				<button
					className={`bg-gray-600 text-white py-4 px-2 w-full mb-${
						isSuccess ? "6" : "8"
					}`}
					type="submit">
					{isLoading ? "Registering..." : "Submit"}
				</button>
				{isSuccess && (
					<p className="text-green-600 text-center mb-6">
						Registration successful!
					</p>
				)}
				{serverError && (
					<p className="text-red-600 text-center mt-6">
						{(error as { data: { message: string } })?.data?.message || ""}
					</p>
				)}
				{!isSuccess && (
					<p className="text-left">
						Already have an account yet? <Link to="/login">Log in</Link>
					</p>
				)}
			</form>
		</div>
	);
};

export default RegistrationPage;
