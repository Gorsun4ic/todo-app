// For faster app loading
import { Suspense, lazy } from "react";

// React Router DOM routes
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

const MainPage = lazy(() => import("pages/Main"));

const RegistrationPage = lazy(() => import("pages/Auth/RegistrationPage"));
const LoginPage = lazy(() => import("pages/Auth/LoginPage"));

function App() {
	return (
		<Suspense>
			<Router>
				<main>
					<Routes>
						<Route path="/" element={<MainPage />} />
						<Route path="/registration" element={<RegistrationPage />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</main>
			</Router>
		</Suspense>
	);
}

export default App;
